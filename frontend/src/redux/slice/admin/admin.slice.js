// features/admin/admin.slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api_admin } from "../../../utils/constant.utils";

// ================= API BASE =================

// ================= THUNKS =================

// Get All Users
export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${api_admin}/get/user/all`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Get One User
export const getOneUser = createAsyncThunk(
  "admin/getOneUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${api_admin}/get/user/${userId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update User Profile
export const adminUpdateUserProfile = createAsyncThunk(
  "admin/adminUpdateUserProfile",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${api_admin}/get/user/${userId}`,  // 👈 matches backend
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update User Avatar
export const adminUpdateUserAvatar = createAsyncThunk(
  "admin/adminUpdateUserAvatar",
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await axios.put(
        `${api_admin}/edit/user/avatar/${userId}`, // 👈 matches backend
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete User
export const adminDeleteUser = createAsyncThunk(
  "admin/adminDeleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${api_admin}/get/user/${userId}`); // 👈 matches backend
      return { userId, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ================= SLICE =================
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAdminState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.allUsers;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get One User
      .addCase(getOneUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOneUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.user;
      })
      .addCase(getOneUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User Profile
      .addCase(adminUpdateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminUpdateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.selectedUser = action.payload.user;
        state.users = state.users.map((u) =>
          u._id === action.payload.user._id ? action.payload.user : u
        );
      })
      .addCase(adminUpdateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User Avatar
      .addCase(adminUpdateUserAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminUpdateUserAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.selectedUser = action.payload.user;
        state.users = state.users.map((u) =>
          u._id === action.payload.user._id ? action.payload.user : u
        );
      })
      .addCase(adminUpdateUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(adminDeleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminDeleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.users = state.users.filter((u) => u._id !== action.payload.userId);
      })
      .addCase(adminDeleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
