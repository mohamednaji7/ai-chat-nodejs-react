
const instracution = `You are an AI intelligent assistant`;
export const SystemInstruction = (fullname, email) =>{
    const constants = `The user name is ${fullname}.
The user email is ${email}.`

    const SystemInstruction = `${instracution}
${constants}`
    return SystemInstruction
}

export const SysRagInst = (fullname, email, retrievedContent) =>{
    return `${SystemInstruction(fullname, email)}
Here is the retrieved documents for the user latest message:
${retrievedContent}`
}


export const geTtitlePrompt = (full_name,  conversation) => {
    const instracution = `Your task is to generate title for conversations going between the user (${username}) and the AI assistant.
The title should be short and to the point, make it 3 words or less.
The title will be displayed on the chat screen, so make suitable to be read by the user.
only words, no numbers, special characters, or symbols.`

    return  `${instracution}

The Conversation:
${conversation}

${instracution}`
}