import ChatRoomModel from "../../models/ChatRoom";
import { useAppDispatch } from "../../redux/hook";
import { roomSelected } from "../../redux/reducers/chatroomReducer";

type ChatRoom = ChatRoomModel;

function ChatRoomComponent(props: ChatRoom) {
    const { name } = props;
    const dispatch = useAppDispatch();

    const onClick = () => {
        dispatch(roomSelected(props));
    }

    return (    
        <div className="w-full px-3 py-2 border-solid border-l-gray-400 border-b-2 text-lg rounded-sm hover:cursor-pointer hover:bg-green-200" onClick={() => onClick()}>
            {name}
        </div>
    )
}

export default ChatRoomComponent;