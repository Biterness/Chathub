import ChatContent from "./ChatContent";

export type ChatMessage = ChatContent & {
    content: string
}

export default ChatMessage;