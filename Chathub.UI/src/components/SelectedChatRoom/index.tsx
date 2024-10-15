import ChatRoom from "../../models/ChatRoom";
import SelectedChatRoomHeaderComponent from "./ChatHeader";
import ChatBarComponent from "./ChatBar";
import ChatSessionComponent from "./ChatSession";

function SelectedChatRoomComponent(props: ChatRoom) {
    const { memberList, contentList } = props;

    return (    
        <div className="w-full h-full flex-col flex">
            <SelectedChatRoomHeaderComponent {...props} />
            <ChatSessionComponent contentList={contentList} memberList={memberList} />
            <ChatBarComponent />
        </div>
    )
}

export default SelectedChatRoomComponent;