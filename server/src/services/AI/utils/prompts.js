// src/services/AI/utils/prompts.js

export const SystemInstruction = (fullname, email) => {
    const guide = 'You are an AI intelligent assistant.';


    const fullInst = `${guide}
<user_info>
The user's full name is: ${fullname}.
The user's email address is: ${email}.
</user_info>
`;
    return fullInst;
};
export const SysRagInst = (fullname, email, retrievedContent) =>{
    return `${SystemInstruction(fullname, email)}
Here is the retrieved documents for the user last message:
${retrievedContent}`
}


export const genTitlePrompt = (full_name,  conversation) => {
    const instruction = `Your task is to generate title for conversations going between the user (${full_name}) and the AI assistant.
The title should be short and to the point, make it 3 words or less.
The title will be displayed on the chat screen, so make suitable to be read by the user.
only words, no numbers, special characters, or symbols.`

    return  `
${instruction}

<conversation>
${conversation}
</conversation>
`
}