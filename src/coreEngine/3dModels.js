import multer from "multer";
import path from 'path';
import OBJFile from "obj-file-parser";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const uploadSingleFile = upload.single('file');

const handleFileUpload = (req, res) => {
    res.send('archivo subido exitosamente');
};

export { uploadSingleFile, handleFileUpload };