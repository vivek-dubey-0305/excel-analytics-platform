// redux/slices/activity.slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api_activity } from "../../../utils/constant.utils.js"; // e.g. `${baseURL}/activity`

// ================== THUNKS ==================

// USER: Get My Activity Logs
export const getMyActivityLogs = createAsyncThunk(
  "activity/getMyActivityLogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api_activity}/my-activity-logs`);
      console.log("RESPONSE OF ACTIVITY LOGS : ", response || response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetching activity logs failed");
    }
  }
);

// ADMIN: Get All Activity Logs (with optional filters)
export const getAllActivityLogs = createAsyncThunk(
  "activity/getAllActivityLogs",
  async ({ userId, action } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (userId) params.userId = userId;
      if (action) params.action = action;

      const response = await axios.get(`${api_activity}/all`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetching all logs failed");
    }
  }
);

// ADMIN: Clear User Logs
export const clearUserLogs = createAsyncThunk(
  "activity/clearUserLogs",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${api_activity}/clear/${userId}`);
      return { ...response.data, userId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Clearing logs failed");
    }
  }
);

// ================== SLICE ==================
const activitySlice = createSlice({
  name: "activity",
  initialState: {
    myActivities: [],
    allActivities: [], // for admin
    clearLogs: false,
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearActivityError: (state) => {
      state.error = null;
    },
    clearActivitySuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // My Logs
    builder
      .addCase(getMyActivityLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.myActivities = action.payload.activities || [];
      })
      .addCase(getMyActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      });

    // All Logs
    builder
      .addCase(getAllActivityLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.allActivities = action.payload.logs || [];
      })
      .addCase(getAllActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      });

    // Clear Logs
    builder
      .addCase(clearUserLogs.pending, (state) => {
        state.clearLogs = true;
      })
      .addCase(clearUserLogs.fulfilled, (state, action) => {
        state.clearLogs = false;
        state.success = true;
        // Remove cleared user logs from admin state
        state.allActivities = state.allActivities.filter(
          (log) => log.user._id !== action.payload.userId
        );
        state.myActivities = [];
      })
      .addCase(clearUserLogs.rejected, (state, action) => {
        state.clearLogs = false;
        state.error = action.payload?.message || action.payload;
      });
  },
});

export const { clearActivityError, clearActivitySuccess } = activitySlice.actions;
export default activitySlice.reducer;
