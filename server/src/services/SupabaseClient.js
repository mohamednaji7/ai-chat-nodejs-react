// src/services/SupabaseClient.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
}
const SupabaseClient = createClient(supabaseUrl, supabaseKey);
export default SupabaseClient