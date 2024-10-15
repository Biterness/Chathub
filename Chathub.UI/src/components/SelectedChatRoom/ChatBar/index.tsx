import { useState, useRef, useEffect } from "react";
import { Paperclip, EmojiWink } from "react-bootstrap-icons";
import { emojiList } from "../../../utils/emojiList/emojiList";

import EmoijiComponent from "./EmojiComponent";

const EmptyString = "";
const SpaceCharacter = " ";
const EnterKey = "Enter";

function ChatBarComponent() {
    const [toggleEmojiList, setToggleEmojiList] = useState<boolean>(false);
    const [chatInput, setChatInput] = useState<string>(EmptyString);
    const chatInputRef = useRef<HTMLInputElement>(null);
    const emojiListRef = useRef<HTMLDivElement>(null);
    
    const onToggleEmojiList = () => setToggleEmojiList(!toggleEmojiList);

    const onChatInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatInput(event.target.value);
    }

    const onEmojiSelected = (code: number) => {
        if(chatInput[chatInput.length-1] === SpaceCharacter || chatInput.length === 0) {
            setChatInput(`${chatInput}${String.fromCodePoint(code)}`)
        } else {
            setChatInput(`${chatInput} ${String.fromCodePoint(code)}`)
        }
    }

    const onInputEnter = (event: React.KeyboardEvent) => {
        if(document.activeElement === chatInputRef.current && event.key === EnterKey && chatInput.length > 0) {
            
            setChatInput(EmptyString);
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiListRef.current && !emojiListRef.current.contains(event.target as Node)) {
              setToggleEmojiList(false);
            }
          }

        document.addEventListener("mouseup", handleClickOutside)
        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
        }
    }, [emojiListRef])

    return (
        <div className="flex-grow-0 h-12 border-t-2 border-black flex">
            <div className="border-r-2 border-black flex-grow-0 flex-shrink-0 content-center p-2 mb-[calc(-2px)] hover:cursor-pointer hover:bg-slate-100">
                <Paperclip size={32} />
            </div>
            <input type="text" name="chatbox" id="chatbox" className="flex-grow p-2 border-b-2" placeholder="Enter message here..." onChange={onChatInputChange} onKeyDown={onInputEnter} value={chatInput} ref={chatInputRef}/>
            <div className="border-l-2 border-black flex-grow-0 flex-shrink-0 content-center p-2 mb-[calc(-2px)] hover:cursor-pointer hover:bg-slate-100" onClick={() => onToggleEmojiList()} ref={emojiListRef}>
                <EmojiWink size={32} />
            </div>
            <div className={`relative inline-block ${toggleEmojiList ? "visible" : "invisible"}`} ref={emojiListRef}>
                <span className="absolute bottom-[calc(110%)] right-0 mr-1 z-10 border-2 border-black rounded-md border-dotted bg-green-100 text-2xl flex flex-wrap w-96 box-content">
                    {emojiList.map((e, index) => <EmoijiComponent emoji={e} onClick={onEmojiSelected} key={index} />)}
                </span>
            </div>
        </div>
    )
}

export default ChatBarComponent;