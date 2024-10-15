import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hook";
import { selectRoomState, fetchRooms } from "../../redux/reducers/chatroomReducer";
import Sidebar from "../../components/Sidebar";
import SelectedChatRoomComponent from "../../components/SelectedChatRoom";
import { ArrowClockwise } from "react-bootstrap-icons";

function HomePage({}) {
    const { isInit, selectedRoom } = useAppSelector(selectRoomState)
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchRooms(null));
    }, []);

    const LoadingScreen = () => (
        <div className="w-full h-full bg-slate-400">
            <ArrowClockwise size={96} color='grey' className="fixed top-[calc(50%-48px)] left-[calc(50%-48px)] animate-spin" />
        </div>
      )
    
    return isInit === false ? <LoadingScreen /> :
    (
        <div className="w-full h-full flex flex-row">
            <div className="border-r-2 border-gray-500 basis-64 shrink-0 h-screen">
                <Sidebar />
            </div>
            <div className="border-b-2 flex-1">
                {selectedRoom != null ? <SelectedChatRoomComponent {...selectedRoom} /> : <div className="w-full h-full flex text-gray-400 justify-center items-center select-none">Select a room or create a new one to start</div>}
            </div>
        </div>
    )
}

export default HomePage;