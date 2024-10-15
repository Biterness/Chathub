import { useEffect, useState } from "react";
import ChatMember from "../../../models/ChatMember";
import ChatMessage from "../../../models/ChatMessage";
import ChatFile from "../../../models/ChatFile";

type ChatContent = (ChatFile | ChatMessage) & {
    Username: string,
    UserId: string
}

function ChatSessionComponent(props: {memberList: ChatMember[], contentList: (ChatMessage | ChatFile)[]}) {
    const { memberList, contentList } = props;
    const [content, setContent] = useState<ChatContent[]>([]);

    useEffect(() => {
        let contentList: ChatContent[] = []

        contentList.forEach(item => {
            const user = memberList.find(member => member.Id === item.UserId)
            if(user != null) {
                contentList.push(getChatContent(user, item))
            }
        })

        contentList.sort((a, b) => a.CreatedAt.getMilliseconds() - b.CreatedAt.getMilliseconds())
        setContent(contentList);
    }, [memberList, contentList, setContent])

    const ContentDisplayComponent = (content: ChatContent) => (
        <div>
            <div>
                {content.Username}
            </div>
            {content.DeletedAt != null ? (
                <div className="italic">
                    Deleted
                </div>
            ) : (
                <div>
                    {"Content" in content ? content.Content : content.Name}
                </div>
            )}
            <div>
                {formatContentTime(content.CreatedAt)}
            </div>
        </div>
    )

    return (
        <div className="flex-grow w-full h-full">
            {content.length > 0 ? content.map(c => ContentDisplayComponent(c)) : <div className="text-gray-400 w-full h-full flex items-end justify-center select-none">Start a conversation</div>}
        </div>
    )
}

function getChatContent(user: ChatMember, content: ChatMessage | ChatFile): ChatContent {
    return {
        ...content,
        UserId: user.Id,
        Username: user.Name
    }
}

function formatContentTime(time: Date): string {
    const oneMinute = 60*1000;
    const oneHour = 60*oneMinute;
    const oneDay = 24*oneHour;
    const timeCheck = Date.now() - time.getMilliseconds();

    if(timeCheck < oneHour) {
        return `${timeCheck/(oneMinute)} minutes ago`
    }

    if(timeCheck < oneDay && time.getDay() == new Date().getDay()) {
        return `${timeCheck/(oneHour)} hours ago`
    }

    return `${time.getHours()}:${time.getMinutes()} ${time.getDay()}/${time.getMonth()}/${time.getFullYear()}`
}

export default ChatSessionComponent;