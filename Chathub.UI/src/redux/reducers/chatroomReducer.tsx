import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest, getRequest } from "../../utils/httpRequest/httpRequest";
import { RootState } from "../store";
import ChatRoom from "../../models/ChatRoom";

export type ChatRoomDto = {
    Name: string,
    Description: string,
    MemberList: string[]
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

export const addRoom = createAsyncThunk('chatroom/add', async (data: ChatRoomDto, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
        let newRoom = await postRequest<ChatRoom>('room', dispatch, data);
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
        }
    },
    extraReducers: builder => {
        builder.addCase(addRoom.fulfilled, (state, { payload }) => {
            state.chatroom.push(payload);
        });

        builder.addCase(fetchRooms.fulfilled, ({}, { payload }) => {
            return {
                chatroom: [...payload],
                isInit: true,
                selectedRoom: undefined
            }
        })
        builder.addCase(fetchRooms.rejected, ({}) => {
            
        })
    }
});

function isChatRoomType(x: any): boolean {
    return "id" in x && "memberList" in x && "contentList" in x;
}

export const selectRoomState = (state: RootState): ChatRoomState => {
    return state.chatrooms
}

export const { roomSelected } = chatRoomSlice.actions;

export default chatRoomSlice.reducer;