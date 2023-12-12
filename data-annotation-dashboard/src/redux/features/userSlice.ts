import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import getCookies from '../../utils/getCookies';

export interface UserState {
    loggedInUser: any;
    token: string;
    users: Array<any>;
    user: any;
}

export interface UsersState {
    id?: string;
    createdAt?: Date;
    userName?: string;
    email?: string;
    phone?: string;
    password?: string;
    Permissions?: any;
}

function parseUserCookie(cookie: string) {
    try {
        return JSON.parse(cookie);
    } catch (error) {
        console.log('Error parsing user cookie');
        return null;
    }
}

const userCookie = getCookies()?.['user'];
const loggedInUser = userCookie ? parseUserCookie(userCookie) : {};

const initialState: UserState = {
    loggedInUser,
    token: getCookies()?.['user_token'] || '',
    users: [],
    user: {},
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<any>) => {
            state.loggedInUser = action.payload.loggedInUser;
            state.token = action.payload.token;
        },
        setUsers: (state, action: PayloadAction<any>) => {
            state.users = action.payload;
        },
        logout: (state) => {
            state.loggedInUser = {};
            state.token = '';
            state.users = [];
        },
    },
});

// Action creators are generated for each case reducer function
export const { login, logout, setUsers } = userSlice.actions;

export default userSlice.reducer;
