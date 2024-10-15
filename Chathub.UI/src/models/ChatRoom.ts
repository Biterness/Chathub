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
    contentList: (ChatMessage|ChatFile)[]
}

export default ChatRoom;