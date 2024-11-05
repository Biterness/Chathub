import { useEffect, useRef } from "react";

function PopupMenuComponent(props: React.PropsWithChildren & {visibility: boolean, onCancel: () => void}) {
    const { visibility, onCancel } = props
    const currentPopupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (currentPopupRef.current && !currentPopupRef.current.contains(event.target as Node)) {
                onCancel();
            }
          }

        document.addEventListener("mouseup", handleClickOutside)
        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
        }
    }, [currentPopupRef])

    return (
        <div className={`z-10 fixed h-screen w-screen top-0 left-0 right-0 bottom-0 text-center items-center justify-center bg-gray-300/75 ${visibility ? "visible" : "invisible"}`}>
            <div className={`inline-block w-fit h-fit mt-12 bg-white border-2 border-black border-solid opacity-100`} ref={currentPopupRef}>
                {props.children}
            </div>
        </div>
    )
}

export default PopupMenuComponent;