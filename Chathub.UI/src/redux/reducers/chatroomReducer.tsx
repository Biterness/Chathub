import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest, getRequest } from "../../utils/httpRequest/httpRequest";

export type ChatRoomDto = {
    Name: string,
    Description: string,
    MemberList: string[]
}

export type ChatMember = {
    Id: string,
    Name: string
}

export type ChatMessage = {
    Id: string,
    Content: string,
    UserId: string,
    CreatedAt: Date,
    UpdatedAt: Date,
    DeletedAt: Date
}

export type ChatFile = {
    Id: string,
    Name: string,
    UserId: string,
    CreatedAt: Date,
    UpdatedAt: Date,
    DeletedAt: Date
}

export type ChatRoom = {
    Id: string,
    Name: string,
    Description: string,
    CanShareFile: boolean,
    CanManageFile: boolean,
    CanManageMember: boolean,
    CanGrantRight: boolean,
    MemberList: ChatMember[],
    MessageList: ChatMessage[],
    FileList: ChatFile[]
}

export type ChatRoomState = {
    isInit: boolean,
    chatroom: ChatRoom[]
}

const initialState: ChatRoomState = {
    isInit: false,
    chatroom: []
}

export const addRoom = createAsyncThunk('chatroom/add', async (data: ChatRoomDto, { rejectWithValue, fulfillWithValue }) => {
    try {
        let newRoom = await postRequest<ChatRoom>('room', JSON.stringify(data));
        return fulfillWithValue(newRoom);
    } catch (error) {
        if(error instanceof Error) {
            return rejectWithValue(error.message);
        }

        return rejectWithValue("Unknown error");
    }
});

export const fetchRooms = createAsyncThunk('chatroom/fetch', async ({}, { rejectWithValue, fulfillWithValue }) => {
    try {
        let chatRooms = await getRequest<ChatRoom[]>('chatroom');
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
            
    },
    extraReducers: builder => {
        builder.addCase(addRoom.fulfilled, (state, { payload }) => {
            state.chatroom.push(payload);
        });

        builder.addCase(fetchRooms.fulfilled, (state, { payload }) => {
            state.chatroom = payload;
            state.isInit = true;
        })
    }
});

export default chatRoomSlice.reducer;