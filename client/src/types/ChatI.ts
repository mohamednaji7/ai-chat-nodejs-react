export interface ChatI {
    _id: string;          // UUID
    user_id: string;      // Foreign key to user_profile
    title: string;
    model_name: string;
    created_at: string;   // ISO timestamp string
    updated_at: string;   // ISO timestamp string
    is_archived: boolean;
  }