import ChatRoom from "../../models/ChatRoom";

function SelectedChatRoomComponent(props: ChatRoom) {
    const { name } = props;

    return (
        <div>
            {name}
        </div>
    )
}

export default SelectedChatRoomComponent;