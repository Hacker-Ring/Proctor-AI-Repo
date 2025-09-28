import { supabase } from './supabase';

export class UserProfileService {
  /**
   * Update current user's phone number in metadata
   */
  static async updateUserPhone(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { phone: phoneNumber }
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating user phone:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update phone number' 
      };
    }
  }

  /**
   * Check if current user has phone number in metadata
   */
  static async hasPhoneNumber(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting user in hasPhoneNumber:', error);
        return false;
      }

      return !!(user?.user_metadata?.phone);
    } catch (error) {
      console.error('Error checking user phone:', error);
      return false;
    }
  }

  /**
   * Get current user's phone number from metadata
   */
  static async getUserPhone(): Promise<string | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting user in getUserPhone:', error);
        return null;
      }

      return user?.user_metadata?.phone || null;
    } catch (error) {
      console.error('Error getting user phone:', error);
      return null;
    }
  }
}
