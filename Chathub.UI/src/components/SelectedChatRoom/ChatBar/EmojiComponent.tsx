import { Emoji } from "../../../utils/emojiList/emojiList";

function EmoijiComponent(props: { emoji: Emoji, onClick: (code: number) => void }) {
    const { emoji, onClick } = props;

    const handleOnClick = () => {
        onClick(emoji.code);
    }

    return (
        <div className="flex-grow-0 py-1 w-12 text-center hover:cursor-pointer hover:bg-green-500 rounded-lg" onClick={handleOnClick}>
            {String.fromCodePoint(emoji.code)}
        </div>
    )
}

export default EmoijiComponent;