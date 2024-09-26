import ChatMember from "./ChatMember";
import ChatMessage from "./ChatMessage";
import ChatFile from "./ChatFile";

type ChatRoom = {
    id: string,
    name: string,
    description: string,
    canShareFile: boolean,
    canManageFile: boolean,
    canManageMember: boolean,
    canGrantRight: boolean,
    memberList: ChatMember[],
    messageList: ChatMessage[],
    fileList: ChatFile[]
}

export default ChatRoom;