import { selectRoomState } from "../../redux/reducers/chatroomReducer";
import { useAppSelector } from "../../redux/hook";
import { useEffect, useState } from "react";
import ChatRoomModel from "../../models/ChatRoom";
import ChatRoomComponent from "./ChatRoom";
import CreateChatRoomComponent from "./CreateChatRoom";
import UserAvatarComponent from "./UserAvatar";

function Sidebar() {
    const [rooms, setRooms] = useState<ChatRoomModel[]>([]);
    const { chatroom } = useAppSelector(selectRoomState);

    useEffect(() => {
        setRooms(chatroom);
    }, [chatroom])

    return (
        <div className="w-full h-full flex flex-col">
            <UserAvatarComponent />
            <CreateChatRoomComponent />
            <div className="flex-1">
                {rooms && rooms.map((room, index) => <ChatRoomComponent {...room} key={index} />)}
            </div>
        </div>
    )
}

export default Sidebar;