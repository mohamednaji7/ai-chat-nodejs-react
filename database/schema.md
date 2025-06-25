currently have the following tables in your public schema:  

chat Columns:  
_id (uuid, primary key)  
user_id (uuid, foreign key referencing auth.users(id))  
title (text)  
numberoftitlegeneratin (integer, default 0)   
model_name (text)  
created_at (timestamp with time zone, default now())  
updated_at (timestamp with time zone, default now())  
is_archived (boolean, default false)  
project_id (uuid, foreign key referencing project(_id))  

file  Columns:  
_id (uuid, primary key)  
name (text)  
content (text)  
tokens (integer)  
created_at (timestamp with time zone, default now())  
updated_at (timestamp with time zone, default now())  
project_id (uuid, foreign key referencing project(_id))  
content_format (text, default 'markdown')  


message Columns:  
_id (uuid, primary key)  
chat_id (uuid, foreign key referencing chat(_id))  
role (text, with a check constraint for specific values)  
content (text)  
tokens_used (integer)    
reaction (integer, default 0)  
created_at (timestamp with time zone, default now())  
is_ui_message (boolean, default true)  
message (jsonb)  

project Columns:  
_id (uuid, primary key)  
name (text, default 'Chats')  
user_id (uuid, foreign key referencing auth.users(id))  
created_at (timestamp with time zone, default now())  
updated_at (timestamp with time zone, default now())  
number (integer)  

reaction Columns:  
message_id (uuid, primary key, foreign key referencing message(_id))  
value (text, with a check constraint for specific values)  

These tables are designed to manage chat-related data, including messages, files, projects, and user reactions.