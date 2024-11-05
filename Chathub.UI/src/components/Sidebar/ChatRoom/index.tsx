import ChatRoomModel from "../../../models/ChatRoom";
import { useAppDispatch } from "../../../redux/hook";
import { roomSelected } from "../../../redux/reducers/chatroomReducer";

type ChatRoom = ChatRoomModel;

function ChatRoomComponent(props: ChatRoom) {
    const { name } = props;
    const dispatch = useAppDispatch();

    const onClick = () => {
        dispatch(roomSelected(props));
    }

    return (    
        <div className="w-full px-3 py-2 border-solid border-b-2 rounded-md hover:cursor-pointer hover:bg-green-200 select-none" onClick={onClick}>
            {name}
        </div>
    )
}

export default ChatRoomComponent;