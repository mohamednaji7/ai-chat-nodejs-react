-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.chat (
  _id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  numberoftitlegeneratin integer DEFAULT 0,
  model_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_archived boolean DEFAULT false,
  project_id uuid NOT NULL,
  CONSTRAINT chat_pkey PRIMARY KEY (_id),
  CONSTRAINT chat_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(_id),
  CONSTRAINT chat_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.file (
  _id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  content text NOT NULL,
  tokens integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  project_id uuid NOT NULL,
  content_format text DEFAULT 'markdown'::text,
  CONSTRAINT file_pkey PRIMARY KEY (_id),
  CONSTRAINT file_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(_id)
);
CREATE TABLE public.message (
  _id uuid NOT NULL DEFAULT uuid_generate_v4(),
  chat_id uuid NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['platform'::text, 'developer'::text, 'assistant'::text, 'user'::text, 'tool'::text])),
  content text,
  tokens_used integer,
  reaction integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  is_ui_message boolean NOT NULL DEFAULT true,
  message jsonb,
  CONSTRAINT message_pkey PRIMARY KEY (_id),
  CONSTRAINT message_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(_id)
);
CREATE TABLE public.project (
  _id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL DEFAULT 'Chats'::text,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  number integer NOT NULL,
  CONSTRAINT project_pkey PRIMARY KEY (_id),
  CONSTRAINT project_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.reaction (
  message_id uuid NOT NULL,
  value text NOT NULL CHECK (value = ANY (ARRAY['UP'::text, 'NONE'::text, 'DOWN'::text])),
  CONSTRAINT reaction_pkey PRIMARY KEY (message_id),
  CONSTRAINT reaction_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.message(_id)
);