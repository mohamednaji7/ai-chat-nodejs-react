import SupabaseClient from '../../SupabaseClient.js';
import {getEmbedding} from '../../AzureOpenAI.js';

import dotenv from 'dotenv';
dotenv.config();

export const retrieveDocuments = async (queryText, matchCount) =>{
    // console.log('retrieveDocuments')
    // console.log(queryText)
    try {

        const queryEmbedding = await getEmbedding(queryText)
        const { data, error } = await SupabaseClient
            .rpc('search_king_kong_quantum_growth', {
                query_embedding: queryEmbedding,
                match_count: matchCount
            });
        
        return data;
    }
    catch (err) {
        console.error('Error executing retrieveDocuments:', err);
        throw err
    }
}
const search_king_kong_quantum_growth = async (query) => {
    console.log('search_king_kong_quantum_growth', query)
    const data = await retrieveDocuments(query, 1)
    // console.log('data')
    // console.log(data[0])
    return data[0].metadata['chunk_content']
}
const callFunction = async (name, args) => {
    console.log('callFunction', name)
    if (name === "search_king_kong_quantum_growth") {
        return await search_king_kong_quantum_growth(args.query);
    }
    console.error('Unknown function: ', name)
    throw new Error(`Unknown function: ${name}`);
};

export const processToolCalls = async ( toolCalls) => {

    try {
        console.log('processToolCalls')
        const tool_messages = [];
        for (const toolCall of toolCalls) {
            console.log("toolCall", toolCall)
            const name = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);
        
            const result = await callFunction(name, args);
    
            // console.log("result", result)
            tool_messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: result.toString()
            });
        }
        return tool_messages

    } catch (error ) {
        console.error(error)
    }
}



export const knowledge_base_assistant_instracution = `You have access to the 'Quantum Growth - King Kong Digital Marketing' knowledge base and must assist the user by providing relevant information from it when needed.  
- Use the \`search_king_kong_quantum_growth\` tool to retrieve **reliable marketing knowledge** when needed.
- If retrieved results are **inconclusive**, offer general considerations instead of speculative answers.`;



const fnName = "search_king_kong_quantum_growth"
const knowledge_base_description = `Search the knowledge base for relevant information about Quantum Growth - King Kong Digital Marketing.`
export const tools = [{
    "type": "function",
    "function": {
        "name": "search_king_kong_quantum_growth",
        "description": knowledge_base_description,
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The detailed and more constructered search query."
                },
            },
            "required": [
                "query",
            ],
            "additionalProperties": false
        },
        "strict": true
    }
}];

 