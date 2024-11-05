type ChatContent = {
    id: string,
    userId: string,
    createdAt: Date,
    updatedAt: Date | undefined,
    deletedAt: Date | undefined
}

export default ChatContent;