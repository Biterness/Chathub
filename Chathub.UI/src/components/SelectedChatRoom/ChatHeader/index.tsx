import ChatRoom from "../../../models/ChatRoom"
import { PersonGear, PersonAdd, InfoSquare } from "react-bootstrap-icons"; 

function ChatHeaderComponent(props: ChatRoom) {
    const { name } = props;

    return (
        <div className="w-full h-12 border-solid border-black border-b-2 py-2 px-3 flex flex-grow-0">
            <div className="flex-1">
                {name}
            </div>
            <div className="flex-shrink-0 flex-grow-0 flex">
                <PersonAdd size={32} className="hover:cursor-pointer hover:bg-green-200 rounded-lg mr-3" />
                <PersonGear size={32} className="hover:cursor-pointer hover:bg-green-200 rounded-lg mr-3" />
                <InfoSquare size={32} className="hover:cursor-pointer hover:bg-green-200" />
            </div>
        </div>
    )
}

export default ChatHeaderComponent;