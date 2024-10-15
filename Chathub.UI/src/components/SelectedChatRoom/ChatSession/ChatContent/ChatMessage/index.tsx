import ChatMember from "../../../../models/ChatMember";
import ChatMessage from "../../../../models/ChatMessage";

type MessageDetail = ChatMessage & ChatMember

function ChatMessageComponent(props: MessageDetail) {
    const { Content, Name, CreatedAt, UpdatedAt, DeletedAt } = props;

    const MessageTimeComponent = () => (
        <div>
            {DeletedAt != null ? "Deleted" : UpdatedAt != null ? `Updated ${UpdatedAt}` : `${CreatedAt}`}
        </div>
    )
    
    return (
        <div>
            <div>
                {Name}
            </div>
            <div>
                {Content}
            </div>
            <MessageTimeComponent />
        </div>
    )
}

export default ChatMessageComponent;