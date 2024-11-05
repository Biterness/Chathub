import { useState } from "react";
import { PlusCircle, DashCircle } from "react-bootstrap-icons";
import { useAppDispatch } from "../../../redux/hook";
import { postRequest } from "../../../utils/httpRequest/httpRequest";
import { addRoom } from "../../../redux/reducers/chatroomReducer";
import PopupMenuComponent from "../../PopupMenu";
import ChatMember from "../../../models/ChatMember";

const EmptyString = "";

function CreateChatRoomComponent() {
    const dispatch = useAppDispatch();
    const [toggleCreateRoomPopup, setToggleCreateRoomPopup] = useState<boolean>(false);
    const [memberList, setMemberList] = useState<ChatMember[]>([]);
    const [inviteInput, setInviteInput] = useState<string>(EmptyString);
    const [inviteErrorMessage, setInviteErrorMessage] = useState<string>(EmptyString);
    const [roomName, setRoomName] = useState<string>(EmptyString);
    const [roomDescription, setRoomDescription] = useState<string>(EmptyString);

    const onClickAddRoom = () => {
        setToggleCreateRoomPopup(true);
    }

    const onCancelAddRoom = () => {
        setToggleCreateRoomPopup(false);
    }

    const onInviteMember = async () => {
        if(inviteErrorMessage != EmptyString) {
            setInviteErrorMessage(EmptyString);
        }

        try {
            if(memberList.filter(mem => mem.email === inviteInput).length > 0) {
                throw new Error("Member already invited");
            }

            const result = await postRequest<ChatMember>("invite", dispatch, {email: inviteInput});
            setMemberList([...memberList, result]);
            setInviteInput(EmptyString);
        } catch (err) {
            if(err instanceof Error) {
                setInviteErrorMessage(err.message);
            }
        }
    }

    const onInputChange = (callback: React.Dispatch<React.SetStateAction<string>>) => (arg: React.FormEvent<HTMLInputElement>) => {
        callback(arg.currentTarget.value);
    }

    const onConfirm = () => {
        dispatch(addRoom({
            name: roomName.trim(),
            description: roomDescription.trim(),
            memberList: memberList
        }));

        setInviteInput(EmptyString);
        setRoomName(EmptyString);
        setRoomDescription(EmptyString);
        setMemberList([]);
        onCancelAddRoom();
    }

    const onMemberRemove = (memberId: string) => {
        let newMemberList = memberList.filter(mem => mem.id !== memberId);
        setMemberList(newMemberList);
    }

    const InviteMemberComponent = (member: ChatMember) => (
        <div className="flex-1 flex">
            <DashCircle size={24} className="m-1 self-center hover:cursor-pointer hover:bg-red-300 rounded-full" onClick={() => onMemberRemove(member.id)}/>
            <p className="m-1 select-none">{member.name}</p>
        </div>
    )

    return (
        <div className="flex p-2 border-b-2 items-center">
            <PopupMenuComponent visibility={toggleCreateRoomPopup} onCancel={onCancelAddRoom}>
                <div className="w-full h-full p-2">
                    <h1 className="text-center mb-2 text-xl">Create Room</h1>
                    <input type="text" name="name" id="name" placeholder="Room name" className="block mb-2 p-1 border-b-2 border-black border-solid" value={roomName} onChange={onInputChange(setRoomName)} />
                    <input type="text" name="description" id="description" placeholder="Description" className="block mb-1 p-1 border-b-2 border-black border-solid" value={roomDescription} onChange={onInputChange(setRoomDescription)}/>
                    <div className="block mb-2">
                        <input type="text" name="memberId" id="memberId" placeholder="Enter user email to invite" className="mb-1 p-1 border-b-2 border-black border-solid" value={inviteInput} onChange={onInputChange(setInviteInput)} />
                        <PlusCircle size={24} className="inline-block hover:cursor-pointer hover:bg-green-100 rounded-full" onClick={onInviteMember} />
                    </div>
                    {inviteErrorMessage != null ? (
                        <div className="text-red-500 text-sm w-full text-wrap -mt-2 text-left">
                            {inviteErrorMessage}
                        </div>
                    ) : null}
                    <div className="flex-col bg-slate-100 mb-2">
                        {memberList.map((m, index) => <InviteMemberComponent {...m} key={index} />)}
                    </div>
                    <button type="button" className="border-black border-2 px-3 py-1 hover:cursor-pointer hover:bg-gray-100 rounded-md mr-4" onClick={onConfirm}>Ok</button>
                    <button type="button" className="border-black border-2 px-3 py-1 hover:cursor-pointer hover:bg-gray-100 rounded-md ml-4" onClick={onCancelAddRoom}>Cancel</button>
                </div>
            </PopupMenuComponent>
            <div className="flex-grow select-none">Rooms</div>
            <PlusCircle className="flex-grow-0 hover:cursor-pointer hover:bg-green-200 rounded-full" size={32} onClick={onClickAddRoom} />
        </div>
    )
}

export default CreateChatRoomComponent;