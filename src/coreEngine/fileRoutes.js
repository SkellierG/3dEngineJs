import { Router } from "express";
import { uploadSingleFile, handleFileUpload } from './3dModels.js';

const router = Router();

router.post('/project', uploadSingleFile, handleFileUpload);

export default router;