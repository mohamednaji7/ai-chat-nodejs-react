import SupabaseClient from './SupabaseClient.js';
import dotenv from 'dotenv';
dotenv.config();

export const retrieveDocuments = async (filter, match_count, query_embedding) =>{
    const { data, error } = await SupabaseClient
    .rpc('match_documents', {
        filter, 
        match_count, 
        query_embedding
    })
    if (error) throw error
    return data;
}

 
