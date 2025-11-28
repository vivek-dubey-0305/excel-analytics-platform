// redux/slices/file.slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api_file } from "../../../utils/constant.utils.js"; // <- keep base url for file API

// ================== THUNKS ==================

// Upload File
export const uploadFile = createAsyncThunk(
  "file/uploadFile",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // <-- must match upload.single("file")

      console.log("formData", [...formData.entries()]);
      // should log: [["file", File]]
      console.log("formData....", formData)
      const config = {

        withCredentials: true,
      };
      const response = await axios.post(`${api_file}/upload`, formData, config);
      console.log("response", response)
      return response.data;
    } catch (error) {
      console.log("first", error)
      return rejectWithValue(error.response?.data || "File upload failed");
    }
  }
);

// Get All Files by User
export const getAllFilesByUser = createAsyncThunk(
  "file/getAllFilesByUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api_file}/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetching files failed");
    }
  }
);

// Get One File
export const getOneFile = createAsyncThunk(
  "file/getOneFile",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api_file}/${fileId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetching file failed");
    }
  }
);

// Delete File
export const deleteFile = createAsyncThunk(
  "file/deleteFile",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${api_file}/${fileId}`);
      return { ...response.data, fileId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);

// Delete All Files
export const deleteAllFiles = createAsyncThunk(
  "file/deleteAllFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${api_file}/delete-all`, {
        withCredentials: true,
      });
      return response.data; // { message, deletedCount }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete all files failed");
    }
  }
);

// Update File Metadata
export const updateFileMeta = createAsyncThunk(
  "file/updateFileMeta",
  async ({ fileId, meta }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${api_file}/${fileId}`, meta);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

// Count Files
export const countFiles = createAsyncThunk(
  "file/countFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api_file}/count`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Count failed");
    }
  }
);

// Get File Columns (schema + sample values)
export const getFileColumns = createAsyncThunk(
  "file/getFileColumns",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api_file}/${fileId}/columns`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetching columns failed");
    }
  }
);

// Get File Data (with pagination)
export const getFileData = createAsyncThunk(
  "file/getFileData",
  async ({ fileId, limit = 1000, offset = 0 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${api_file}/${fileId}/data?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetching data failed");
    }
  }
);

// ================== SLICE ==================
const fileSlice = createSlice({
  name: "file",
  initialState: {
    files: [],
    file: null,
    deletingAll: false,
    fileColumns: [],
    fileSampleValues: {},
    fileData: [],
    fileCount: 0,
    loading: false,
    error: null,
    success: false,

  },

  reducers: {
    clearFileError: (state) => {
      state.error = null;
    },
    clearFileSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // Upload
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.file = action.payload.file;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      });

    // Get All
    builder
      .addCase(getAllFilesByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFilesByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload.files || [];
      })
      .addCase(getAllFilesByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      });

    // Get One
    builder
      .addCase(getOneFile.fulfilled, (state, action) => {
        state.file = action.payload.file || null;
      });

    // Delete
    builder
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter((f) => f._id !== action.payload.fileId);
      });

    // Delete ALl
    builder
      .addCase(deleteAllFiles.pending, (state) => {
        state.deletingAll = true;
      })
      .addCase(deleteAllFiles.fulfilled, (state, action) => {
        state.deletingAll = false;
        state.success = true;
        state.files = []; // ✅ clear all files from store
      })
      .addCase(deleteAllFiles.rejected, (state, action) => {
        state.deletingAll = false;
        state.error = action.payload?.message || action.payload;
      });

    // Update
    builder
      .addCase(updateFileMeta.fulfilled, (state, action) => {
        const updatedFile = action.payload.file;
        state.files = state.files.map((f) =>
          f._id === updatedFile._id ? updatedFile : f
        );
      });

    // Count
    builder
      .addCase(countFiles.fulfilled, (state, action) => {
        state.fileCount = action.payload.filesCount || 0;
      });

    // Columns
    builder
      .addCase(getFileColumns.fulfilled, (state, action) => {
        state.fileColumns = action.payload.columns || [];
        state.fileSampleValues = action.payload.sampleValues || {};
      });

    // Data
    builder
      .addCase(getFileData.fulfilled, (state, action) => {
        state.fileData = action.payload.rows || [];
      });
  },
});

export const { clearFileError, clearFileSuccess } = fileSlice.actions;
export default fileSlice.reducer;
