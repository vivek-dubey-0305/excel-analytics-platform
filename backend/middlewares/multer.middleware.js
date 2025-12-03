import multer from "multer";
import fs from "fs";
import path from "path";

//* local storage m rakhne k liye
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        console.log("\n-----------\nMULTER.js\n-----------\n");
        const uploadPath = "./public/temp/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath)


    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer({
    storage,
})