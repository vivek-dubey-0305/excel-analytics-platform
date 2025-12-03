import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api_user } from "../../../utils/constant.utils.js";

// NOTE: Server sets httpOnly cookies (accessToken / refreshToken). We must send credentials with requests.
axios.defaults.withCredentials = true;

// ---------------------- ASYNC THUNKS ---------------------- //

// Register
export const register = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${api_user}/register`, userData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Registration failed" });
    }
});

// Login
export const login = createAsyncThunk("user/login", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${api_user}/login`, userData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Login failed" });
    }
});

// Dashboard / get logged in user
export const getUser = createAsyncThunk("user/getUser", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${api_user}/dashboard`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to load user" });
    }
});

// Logout
export const logout = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${api_user}/logout`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Logout failed" });
    }
});

// Verify OTP
export const verifyOtp = createAsyncThunk("user/verifyOtp", async (otpData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${api_user}/verify-otp`, otpData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "OTP verification failed" });
    }
});

// Change current password (user authenticated)
export const changePassword = createAsyncThunk(
    "user/changePassword",
    async (passwords, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${api_user}/password/update-password`, passwords, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Change password failed" });
        }
    }
);

// Update profile (fullName, email, phone, gender, social_links)
export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${api_user}/update-profile`, profileData, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Update profile failed" });
        }
    }
);

// Update avatar (multipart/form-data)
export const updateAvatar = createAsyncThunk("user/updateAvatar", async (fileData, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        // expected fileData = { file: File }
        formData.append("avatar", fileData.file);

        const response = await axios.put(`${api_user}/update-avatar`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Avatar update failed" });
    }
});

// Get logged in user info
export const getLoggedInUserInfo = createAsyncThunk("user/getLoggedInUserInfo", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${api_user}/me`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to fetch user" });
    }
});

// Delete user account
export const deleteUser = createAsyncThunk("user/deleteUser", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${api_user}/delete`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Delete user failed" });
    }
});

// ---------------------- SLICE ---------------------- //
const initialState = {
    user: null,
    loading: false,
    error: null,
    success: null,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        removerErrors: (state) => {
            state.error = null;
        },
        removerSuccess: (state) => {
            state.success = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = Boolean(action.payload);
        },
    },
    extraReducers: (builder) => {
        // Generic matcher helper to reduce duplication
        const addPending = (name) => builder.addCase(name.pending, (state) => { state.loading = true; state.error = null; });
        const addFulfilled = (name, cb) => builder.addCase(name.fulfilled, (state, action) => { state.loading = false; state.error = null; cb(state, action); });
        const addRejected = (name) => builder.addCase(name.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || action.error?.message || "Something went wrong"; });

        // register
        addPending(register);
        addFulfilled(register, (state, action) => {
            state.success = action.payload?.success || null;
            state.user = action.payload?.user || null;
            state.isAuthenticated = Boolean(action.payload?.user);
        });
        addRejected(register);

        // login
        addPending(login);
        addFulfilled(login, (state, action) => {
            state.success = action.payload?.success || null;
            state.user = action.payload?.user || null;
            state.isAuthenticated = Boolean(action.payload?.user);
        });
        addRejected(login);

        // getUser / dashboard
        addPending(getUser);
        addFulfilled(getUser, (state, action) => {
            state.success = action.payload?.success || null;
            state.user = action.payload?.user || null;
            state.isAuthenticated = Boolean(action.payload?.user);
        });
        addRejected(getUser);

        // logout
        addPending(logout);
        addFulfilled(logout, (state) => {
            state.success = true;
            state.user = null;
            state.isAuthenticated = false;
        });
        addRejected(logout);

        // changePassword
        addPending(changePassword);
        addFulfilled(changePassword, (state, action) => { state.success = action.payload?.success || true; });
        addRejected(changePassword);

        // updateProfile
        addPending(updateProfile);
        addFulfilled(updateProfile, (state, action) => {
            state.success = action.payload?.success || true;
            state.user = action.payload?.user || state.user;
            state.isAuthenticated = Boolean(state.user);
        });
        addRejected(updateProfile);

        // updateAvatar
        addPending(updateAvatar);
        addFulfilled(updateAvatar, (state, action) => {
            state.success = action.payload?.success || true;
            state.user = action.payload?.user || state.user;
        });
        addRejected(updateAvatar);

        // getLoggedInUserInfo
        addPending(getLoggedInUserInfo);
        addFulfilled(getLoggedInUserInfo, (state, action) => {
            state.user = action.payload?.user || null;
            state.isAuthenticated = Boolean(action.payload?.user);
        });
        addRejected(getLoggedInUserInfo);

        // deleteUser
        addPending(deleteUser);
        addFulfilled(deleteUser, (state, action) => {
            state.success = action.payload?.success || true;
            state.user = null;
            state.isAuthenticated = false;
        });
        addRejected(deleteUser);
    },
});

export const { removerErrors, removerSuccess, setUser } = userSlice.actions;
export default userSlice.reducer;
