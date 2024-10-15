import ChatContent from "./ChatContent";

export type ChatMessage = ChatContent & {
    Content: string
}

export default ChatMessage;