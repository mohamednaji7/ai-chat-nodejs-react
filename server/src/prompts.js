
export const SystemInstruction = (fullname, email) =>{
    const instracution = `You are an AI intelligent assistant`;
    const constants = `The user name is ${fullname}
The user email is ${email}`

    const SystemInstruction = `${instracution}
${constants}`
    return SystemInstruction
}

export const SysRagInst = (fullname, email, retrievedContent) =>{
    return `${SystemInstruction(fullname, email)}
Here is the retrieved documents for the user latest message:
${retrievedContent}`
}


export const geTtitlePrompt = (fullname, email,  conversation) => {

    return  `Only generate a title for the conversation so far.
SystemInstruction:
${SystemInstruction(fullname, email)}
conversation:
${conversation}

Only generate a title for the conversation so far.`

}