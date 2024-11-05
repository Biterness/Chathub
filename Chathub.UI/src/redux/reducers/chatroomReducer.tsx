import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest, getRequest } from "../../utils/httpRequest/httpRequest";
import { RootState } from "../store";
import ChatRoom from "../../models/ChatRoom";
import ChatMember from "../../models/ChatMember";

export type ChatRoomDto = {
    name: string,
    description: string,
    memberList: string[]
}

export type InviteDto = {
    email: string
}

export type CreateChatRoom = {
    name: string,
    description: string,
    memberList: ChatMember[]
}

export type ChatRoomState = {
    isInit: boolean,
    chatroom: ChatRoom[],
    selectedRoom: ChatRoom | undefined
}

const initialState: ChatRoomState = {
    isInit: false,
    chatroom: [],
    selectedRoom: undefined
}

export const addRoom = createAsyncThunk('chatroom/add', async (roomInfo: CreateChatRoom, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
        if(roomInfo == null) {
            return rejectWithValue("Missing room info");
        }

        let newRoom = await postRequest<ChatRoom>('chatroom', dispatch, convertToChatRoomDto(roomInfo));
        return fulfillWithValue(newRoom);
    } catch (error) {
        if(error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue("Unknown error");
    }
});

export const fetchRooms = createAsyncThunk('chatroom/fetch', async (_: null, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
        let chatRooms = await getRequest<ChatRoom[]>('chatroom', dispatch);
        return fulfillWithValue(chatRooms);
    } catch (error) {
        if(error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue("Unknown error");
    }
})

export const chatRoomSlice = createSlice({
    name: 'chatroom',
    initialState,
    reducers: {
        roomSelected: (state, { payload }) => {
            if(isChatRoomType(payload)) {
                return {
                    ...state,
                    selectedRoom: payload
                }
            }

            return {
                ...state
            }
        },
        createRoomUpdated: (state, {payload}) => {
            if(isCreateChatRoomType(payload)) {
                return {
                    ...state,
                    createRoom: payload
                }
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(addRoom.fulfilled, (state, { payload }) => {
            state.chatroom.push(payload);
        });
        builder.addCase(addRoom.rejected, (state, {payload}) => {
            return {
                ...state,
                createRoomError: typeof payload === 'string' ? payload : undefined 
            }
        });

        builder.addCase(fetchRooms.fulfilled, (state, { payload }) => {
            return {
                ...state,
                chatroom: [...payload],
                isInit: true,
                selectedRoom: undefined,
            }
        })
        builder.addCase(fetchRooms.rejected, ({}) => {
            
        })
    }
});

function convertToChatRoomDto(data: CreateChatRoom): ChatRoomDto {
    return {
        ...data,
        memberList: [
            ...data.memberList.map(m => m.id)
        ]
    }
}

function isChatRoomType(arg: any): boolean {
    return  "id" in arg && "name" in arg &&
            "description" in arg &&
            "canShareFile" in arg && 
            "canManageFile" in arg &&
            "canManageMember" in arg &&
            "canGrantRight" in arg &&
            "memberList" in arg &&
            "contentList" in arg;
}

function isCreateChatRoomType(arg: any): boolean {
    return  "name" in arg &&
            "description" in arg &&
            "memberList" in arg;
}

export const selectRoomState = (state: RootState): ChatRoomState => {
    return state.chatrooms
}

export const { roomSelected } = chatRoomSlice.actions;

export default chatRoomSlice.reducer;