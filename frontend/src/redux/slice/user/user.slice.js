// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import axios from "axios"
// import { api_user } from "../../../utils/constant.utils.js";


// // Register
// export const register = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
//     try {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }
//         console.log(api_user)
//         const response = await axios.post(`${api_user}/register`, userData, config);
//         console.log("REGISTER DATA", response);
//         return response.data

//     } catch (error) {
//         return rejectWithValue(error.response?.data || "Registration failed, Please try again after some time")
//     }
// })


// // Login
// export const login = createAsyncThunk("user/login", async (userData, { rejectWithValue }) => {
//     try {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }

//         const response = await axios.post(`${api_user}/login`, userData);
//         console.log("LOGIN DATA", response);
//         return response.data

//     } catch (error) {
//         return rejectWithValue(error.response?.data || "Login failed, Please try again after some time")
//     }
// })

// // *logout
// export const logout = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
//     try {
//         const response = await axios.post(`${api_user}/logout`);
//         return response.data;
//     } catch (error) {
//         return rejectWithValue(error.response?.data || "Logout failed, Please try again later");
//     }
// });

// // *send otp
// export const sendOtp = createAsyncThunk("user/sendOtp", async (_, { rejectWithValue }) => {
//     try {
//         const response = await axios.get(`${api_user}/send-otp`);
//         return response.data;
//     } catch (error) {
//         return rejectWithValue(error.response?.data || "OTP request failed");
//     }
// });

// // *verify-otp
// export const verifyOtp = createAsyncThunk("user/verifyOtp", async (otpData, { rejectWithValue }) => {
//     try {
//         const response = await axios.post(`${api_user}/verify-otp`, otpData);
//         return response.data;
//     } catch (error) {
//         return rejectWithValue(error.response?.data || "OTP verification failed");
//     }
// });


// // DASHBOARD
// export const getUser = createAsyncThunk("user/getUser", async (_, { rejectWithValue }) => {
//     try {
//         console.log("OVER HRE CALLED")
//         const response = await axios.get(`${api_user}/dashboard`);
//         console.log("USER DATA", response);
//         return response.data

//     } catch (error) {
//         return rejectWithValue(error.response?.data || "DAshbord load failed, Please try again after some time")
//     }
// })

// const userSlice = createSlice({
//     name: "user",
//     initialState: {
//         user: null,
//         loading: false,
//         error: null,
//         success: false,
//         isAuthenticated: false
//     },

//     reducers: {
//         removerErrors: (state) => {
//             state.error = null
//         },
//         removerSuccess: (state) => {
//             state.success = null
//         }
//     },


//     extraReducers: (builder) => {
//         // *REGISTER
//         builder
//             .addCase(register.pending, (state) => {
//                 state.loading = true;
//                 state.error = null
//             })
//             .addCase(register.fulfilled, (state, action) => {
//                 console.log("Fullfilled actio payload - USER", action)
//                 state.loading = false
//                 state.error = null
//                 state.success = action.payload.success
//                 state.user = action.payload?.user || null
//                 state.isAuthenticated = Boolean(action.payload?.user)
//             })
//             .addCase(register.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload?.message || "Something went wrong"
//                 state.user = null
//                 state.isAuthenticated = false
//             })

//         // *LOGIN
//         builder
//             .addCase(login.pending, (state) => {
//                 state.loading = true;
//                 state.error = null
//             })
//             .addCase(login.fulfilled, (state, action) => {
//                 console.log("Fullfilled actio payload - USER", action)
//                 state.loading = false
//                 state.error = null
//                 state.success = action.payload.success
//                 state.user = action.payload?.user || null
//                 state.isAuthenticated = Boolean(action.payload?.user)
//             })
//             .addCase(login.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload?.message || "Something went wrong"
//                 state.user = null
//                 state.isAuthenticated = false
//             })


//         // *LOGOUT
//         builder
//             .addCase(logout.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(logout.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.success = action.payload.success;
//                 state.user = null;
//                 state.isAuthenticated = false;
//             })
//             .addCase(logout.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload?.message || "Logout failed";
//             });

//         // *SEND OTP
//         builder
//             .addCase(sendOtp.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(sendOtp.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.success = action.payload.success;
//             })
//             .addCase(sendOtp.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload?.message || "OTP request failed";
//             });

//         // *VERIFY OTP
//         builder
//             .addCase(verifyOtp.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(verifyOtp.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.success = action.payload.success;
//                 state.user = action.payload?.user || null;
//                 state.isAuthenticated = Boolean(action.payload?.user);
//             })
//             .addCase(verifyOtp.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload?.message || "OTP verification failed";
//                 state.isAuthenticated = false;
//             });

//         // DASHBOARD
//         builder
//             .addCase(getUser.pending, (state) => {
//                 // console.log("PEMDING actio payload - USERDASHBOARD", action)

//                 state.loading = true;
//                 state.error = null
//                 console.log("IsACUTHENTICATED - prnding: 0/1", state.isAuthenticated)

//             })
//             .addCase(getUser.fulfilled, (state, action) => {
//                 console.log("Fullfilled actio payload - USERDASHBOARD", action)
//                 state.loading = false
//                 state.error = null
//                 state.success = action.payload.success
//                 state.user = action.payload?.user || null
//                 state.isAuthenticated = Boolean(action.payload?.user)
//                 console.log("IsACUTHENTICATED : 0/1", state.isAuthenticated)
//             })
//             .addCase(getUser.rejected, (state, action) => {
//                 console.log("REJECTED actio payload - USERDASHBOARD", action)

//                 state.loading = false;
//                 state.error = action.payload?.message || "Something went wrong"
//                 state.user = null
//                 state.isAuthenticated = false
//             })
//     }
// })


// export const { removerErrors, removerSuccess } = userSlice.actions;
// export default userSlice.reducer;


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

// Send OTP (GET)
export const sendOtp = createAsyncThunk("user/sendOtp", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${api_user}/send-otp`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "OTP request failed" });
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

// Send reset password link
export const sendResetLink = createAsyncThunk("user/sendResetLink", async (emailData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${api_user}/password/forgot-password`, emailData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to send reset link" });
    }
});

// Reset password using token (token in URL params)
export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ token, passwordData }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${api_user}/password/forgot-password/${token}`, passwordData, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Password reset failed" });
        }
    }
);

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

        // sendOtp
        addPending(sendOtp);
        addFulfilled(sendOtp, (state, action) => { state.success = action.payload?.success || true; });
        addRejected(sendOtp);

        // verifyOtp
        addPending(verifyOtp);
        addFulfilled(verifyOtp, (state, action) => {
            state.success = action.payload?.success || null;
            state.user = action.payload?.user || null;
            state.isAuthenticated = Boolean(action.payload?.user);
        });
        addRejected(verifyOtp);

        // sendResetLink
        addPending(sendResetLink);
        addFulfilled(sendResetLink, (state, action) => { state.success = action.payload?.success || true; });
        addRejected(sendResetLink);

        // resetPassword
        addPending(resetPassword);
        addFulfilled(resetPassword, (state, action) => { state.success = action.payload?.success || true; });
        addRejected(resetPassword);

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
