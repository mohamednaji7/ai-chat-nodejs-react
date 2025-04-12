// CONFIG
import dotenv from 'dotenv';
dotenv.config();

import SupabaseClient from '../services/SupabaseClient.js';
import {retrieveDocuments} from '../services/AI/utils/RAG.js';

// const queryEmbedding = new Array(1536).fill(0.1);
// const { data, error } = await SupabaseClient
// .rpc('search_king_kong_quantum_growth', {
//     query_embedding: queryEmbedding,
//     match_count: 1
// });

const queryText = 'marketing strategy';
const data = await retrieveDocuments(queryText, 1);

// console.log(data)
// console.log(data[0].metadata['chunk_content'])

console.log(data[0].metadata['chunk_idx'])
console.log(data[0].metadata['group'])
console.log(data[0].metadata['number_of_chunks'])
console.log(data[0].metadata['original_doc_index'])
console.log(data[0].similarity)
console.log(data[0].id)
console.log(data.length)

