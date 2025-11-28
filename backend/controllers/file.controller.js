// controllers/file.controller.js
import { File } from "../models/file.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
// import cloudinary from "cloudinary";
import { destroyOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import xlsx from "xlsx";

import path from "path";
import { fileURLToPath } from "url";
import { cloudinaryFileRefer } from "../utils/constants.utils.js";
import { logActivity } from "../utils/logActivity.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// ================== UPLOAD FILE ==================
export const uploadFile = async (req, res) => {
    try {
        console.log("req.file: ", req.file)
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // 1️⃣ Upload file to cloudinary
        // const result = await cloudinary.v2.uploader.upload(req.file.path, {
        //   folder: "excel-analytics/files",
        //   resource_type: "auto",
        // });

        // 2️⃣ Parse file with SheetJS (optional)
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const result = await uploadOnCloudinary(req?.file?.path, cloudinaryFileRefer, req?.user, req?.file?.originalname)
        console.log("Result: ", result)

        // 3️⃣ Save in DB
        const fileDoc = await File.create({

            uploadedBy: req?.user?._id,
            originalName: req?.file?.originalname,
            format: req?.file?.mimetype,
            size: req?.file?.size,
            cloudinaryId: result?.public_id,
            fileUrl: result?.secure_url,
            parsedSample: sheetData.slice(0, 20),
            parsedData: sheetData,
        });
        await fileDoc.save()

        // 4️⃣ Log Activity
        await logActivity(req?.user?._id, "upload", `Uploaded file: ${req?.file?.originalname}`, req);
        // await ActivityLog.create({
        //     user: req?.user?._id,
        //     action: "upload",
        //     description: `Uploaded file: ${req?.file?.originalname}`,
        // });

        res.status(201).json({
            message: "File uploaded successfully",
            file: fileDoc,
        });
    } catch (error) {
        res.status(500).json({ message: error?.message });
    }
};


export const getAllFilesByUser = async (req, res) => {
    try {
        const files = await File.find({ uploadedBy: req.user._id }).sort({
            createdAt: -1,
        });

        res.status(200).json({ files });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== GET ONE FILE ==================
export const getOneFile = async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            uploadedBy: req.user._id,
        });

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        res.status(200).json({ file });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== DELETE FILE ==================

export const deleteFile = async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            uploadedBy: req.user._id,
        });

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // 1️⃣ Delete from Cloudinary
        // await cloudinary.v2.uploader.destroy(file.cloudinaryId);
        await destroyOnCloudinary(file?.cloudinaryId, cloudinaryFileRefer)

        // 2️⃣ Delete from DB
        await file.deleteOne();

        // 3️⃣ Log activity
        await logActivity(req.user._id, "delete", `Deleted file: ${file.originalName}`, req);
        // await ActivityLog.create({
        //     user: req.user._id,
        //     action: "delete",
        //     description: `Deleted file: ${file.originalName}`,
        // });

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== DELETE ALL FILE ==================
export const deleteAllFiles = async (req, res) => {
    try {
        // 1️⃣ Fetch all files uploaded by the user
        const files = await File.find({ uploadedBy: req.user._id });
        console.log("Files", files)
        if (!files || files.length === 0) {
            return res.status(404).json({ message: "No files found to delete" });
        }

        // 2️⃣ Delete each file from Cloudinary + DB
        for (const file of files) {
            try {
                console.log("HERE")
                if (file.cloudinaryId) {
                    await destroyOnCloudinary(file.cloudinaryId, "file"); // assuming `cloudinaryFileRefer` = "file"
                }
                await file.deleteOne();

                // Log each deletion
                await logActivity(
                    req.user._id,
                    "delete",
                    `Deleted file: ${file.originalName}`,
                    req
                );
            } catch (err) {
                console.error(`❌ Failed to delete file ${file.originalName}:`, err);
            }
        }

        // 3️⃣ Respond back
        res.status(200).json({
            message: "All files deleted successfully",
            deletedCount: files.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== UPDATE FILE META ==================
export const updateFileMeta = async (req, res) => {
    try {
        const { name, tags } = req.body;

        const file = await File.findOneAndUpdate(
            { _id: req.params.id, uploadedBy: req.user._id },
            { $set: { name, tags } },
            { new: true }
        );

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        await logActivity(req?.user?._id, "update", `Updated metadata for file: ${file?.originalName}`, req);
        // await ActivityLog.create({
        //     user: req.user._id,
        //     action: "update",
        //     description: `Updated metadata for file: ${file.originalName}`,
        // });

        res.status(200).json({ file });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ================== COUNT FILES ==================
export const countFiles = async (req, res) => {
    try {
        const filesCount = await File.find({ uploadedBy: req?.user?._id }).sort({
            createdAt: -1,
        }).countDocuments();

        res.status(200).json({ filesCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// controllers/file.controller.js (add)
export const getFileColumns = async (req, res) => {
    try {
        const file = await File.findOne({ _id: req.params.id, uploadedBy: req.user._id }).select("parsedSample parsedData");
        if (!file) return res.status(404).json({ message: "File not found" });

        const sample = file.parsedSample && file.parsedSample.length ? file.parsedSample : (file.parsedData && file.parsedData.slice(0, 20)) || [];

        // columns = keys of first row (if any)
        const columns = sample.length ? Object.keys(sample[0]) : [];

        // sampleValues: for each column, return a few distinct sample values
        const sampleValues = {};
        columns.forEach(col => {
            const vals = sample.map(r => r[col]).filter(v => v !== null && v !== undefined);
            sampleValues[col] = [...new Set(vals)].slice(0, 10); // unique first 10
        });

        res.status(200).json({ columns, sampleValues });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// * Pagination useful for larger sheets
export const getFileData = async (req, res) => {
    try {
        const { limit = 1000, offset = 0 } = req.query;
        const file = await File.findOne({ _id: req.params.id, uploadedBy: req.user._id }).select("parsedData");
        if (!file) return res.status(404).json({ message: "File not found" });

        const data = file.parsedData || [];

        // simple pagination
        const start = parseInt(offset, 10) || 0;
        const end = Math.min(start + parseInt(limit, 10), data.length);

        res.status(200).json({ totalRows: data.length, rows: data.slice(start, end) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
