# Call Center Automation Software

This software automates communication for call centers through AI-powered inbound and outbound call services. We leverage **Supabase** as the backend for database management and storage. The data is stored on Supabase, and the uploaded blob URLs are used to feed information to the AI agents. Users can upload documents in formats like **PDF**, **DOCX**, and **TXT**.

## User Roles and Dashboards

There will be two role-based dashboards:

### 1. **Admin Panel**
- Designed for institutional heads to manage the software.

### 2. **Admission Officer Panel**
- Accessible by individuals who have been granted credentials by the Admin.

## Workflow

1. **User Interaction**: When a user calls customer support, the process begins with a **Twilio** integration. Twilio triggers a webhook URL, and our backend fetches the knowledge base associated with the user.
   - The knowledge base is passed through the **RAG (Retrieval-Augmented Generation)** layer to provide context for the AI, ensuring the voice agent has relevant and up-to-date information about the user and the vendor's business model.

2. **Connection**: Our custom backend server connects the user to the Voice AI agent via **WebSockets**, enabling real-time communication.

3. **Vendor Dashboard**: Vendors receive real-time updates on their dashboard as the interaction progresses.

4. **AI Knowledge Base**: The system uses the **RAG (Retrieval-Augmented Generation)** layer to provide the LLM (Large Language Model) with relevant knowledge, ensuring accurate and contextual responses.

---

