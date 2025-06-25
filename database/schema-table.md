| table_name | column_name            | data_type                |
| ---------- | ---------------------- | ------------------------ |
| chat       | _id                    | uuid                     |
| chat       | user_id                | uuid                     |
| chat       | title                  | text                     |
| chat       | numberoftitlegeneratin | integer                  |
| chat       | model_name             | text                     |
| chat       | created_at             | timestamp with time zone |
| chat       | updated_at             | timestamp with time zone |
| chat       | is_archived            | boolean                  |
| chat       | project_id             | uuid                     |
| file       | _id                    | uuid                     |
| file       | name                   | text                     |
| file       | content                | text                     |
| file       | tokens                 | integer                  |
| file       | created_at             | timestamp with time zone |
| file       | updated_at             | timestamp with time zone |
| file       | project_id             | uuid                     |
| file       | content_format         | text                     |
| message    | _id                    | uuid                     |
| message    | chat_id                | uuid                     |
| message    | role                   | text                     |
| message    | content                | text                     |
| message    | tokens_used            | integer                  |
| message    | reaction               | integer                  |
| message    | created_at             | timestamp with time zone |
| message    | is_ui_message          | boolean                  |
| message    | message                | jsonb                    |
| project    | _id                    | uuid                     |
| project    | name                   | text                     |
| project    | user_id                | uuid                     |
| project    | created_at             | timestamp with time zone |
| project    | updated_at             | timestamp with time zone |
| project    | number                 | integer                  |
| reaction   | message_id             | uuid                     |
| reaction   | value                  | text                     |