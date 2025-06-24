// src/services/AI/Function/getFullFileContent.js

import ProjectService from "../../Database/Project.js";
import dotenv from 'dotenv';
dotenv.config();
import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";



const funInfo = {
    // get the full file content
    name: 'get_full_file_content',

    description: "Gets the full content of a file.",
    
    parameters : z.object({
        file_id: z.string().describe('The id of the file'),
    })
}





const functionExecation = async ({file_id}) => {
    console.log(funInfo.name, ' | ', {file_id});
    return 'Not supported yet';
    
    // read teh file
    const fileData = await ProjectService.getProjectFile(file_id);
    const content = fileData.content;
    return content;
}


const functionCall = async (args, session) =>{
    console.log('functionCall', funInfo.name, session)

    // before execuation

    // execute
    const result = await functionExecation({...args});

    // after execuation

    // return
    return result;    
}


export default  {
    functionImpl: functionCall,
    openai_tool: zodFunction(funInfo)
}




