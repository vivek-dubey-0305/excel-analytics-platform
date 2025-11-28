import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/user/user.slice.js"
import activityReducer from "../slice/activity/activity.slice.js"
import fileReducer from "../slice/file/file.slice.js"
import adminReducer from "../slice/admin/admin.slice.js"
export const store = configureStore({
    reducer: {
        user: userReducer,
        activity: activityReducer,
        file: fileReducer,
        admin: adminReducer,
    },
})