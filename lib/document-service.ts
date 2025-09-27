import { supabase } from './supabase'
import { Database } from './database.types'

type KnowledgeBase = Database['public']['Tables']['knowledge_base']['Row']
type KnowledgeBaseInsert = Database['public']['Tables']['knowledge_base']['Insert']
type KnowledgeBaseUpdate = Database['public']['Tables']['knowledge_base']['Update']

export class DocumentService {
  /**
   * Upload a document to Supabase Storage and save metadata to database
   */
  static async uploadDocument(
    userId: string,
    file: File,
    documentType: string
  ): Promise<KnowledgeBase> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`
      
      console.log('Uploading file:', fileName, 'for user ID:', userId)
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      console.log('File uploaded successfully:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      console.log('Public URL generated:', publicUrl)

      // Save metadata to database
      const documentData: KnowledgeBaseInsert = {
        user_id: userId,
        document_name: file.name,
        document_url: publicUrl,
        document_type: documentType,
        file_size: file.size,
        upload_date: new Date().toISOString()
      }

      console.log('Inserting document data:', documentData)

      const { data, error } = await supabase
        .from('knowledge_base')
        .insert(documentData)
        .select()
        .single()

      if (error) {
        console.error('Database insert error:', error)
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('documents').remove([fileName])
        throw new Error(`Database insert failed: ${error.message}`)
      }

      console.log('Document saved successfully:', data)
      return data
    } catch (error) {
      console.error('Document upload error:', error)
      throw error
    }
  }

  /**
   * Get all documents for a user
   */
  static async getUserDocuments(userId: string): Promise<KnowledgeBase[]> {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch documents: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Get documents error:', error)
      throw error
    }
  }

  /**
   * Get a specific document by ID
   */
  static async getDocument(documentId: string, userId: string): Promise<KnowledgeBase | null> {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('id', documentId)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Document not found
        }
        throw new Error(`Failed to fetch document: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Get document error:', error)
      throw error
    }
  }

  /**
   * Delete a document
   */
  static async deleteDocument(documentId: string, userId: string): Promise<void> {
    try {
      // First get the document to get the file path
      const document = await this.getDocument(documentId, userId)
      if (!document) {
        throw new Error('Document not found')
      }

      // Extract file path from URL
      const url = new URL(document.document_url)
      const filePath = url.pathname.split('/').slice(-2).join('/') // Get clerk_id/filename

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath])

      if (storageError) {
        console.warn('Storage deletion failed:', storageError.message)
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', documentId)
        .eq('user_id', userId)

      if (dbError) {
        throw new Error(`Database deletion failed: ${dbError.message}`)
      }
    } catch (error) {
      console.error('Delete document error:', error)
      throw error
    }
  }

  /**
   * Update document metadata
   */
  static async updateDocument(
    documentId: string,
    userId: string,
    updates: Partial<KnowledgeBaseUpdate>
  ): Promise<KnowledgeBase> {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .update(updates)
        .eq('id', documentId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        throw new Error(`Update failed: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Update document error:', error)
      throw error
    }
  }
}
