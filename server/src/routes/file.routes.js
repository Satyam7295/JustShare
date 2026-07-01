import express, { Router } from "express"
import upload from "../middlewares/upload.middlewares.js";
import { deleteFile, downloadInfo, downloadFile, generateQR, generateShareShortenLink, getDownloadCount, getFileDetails, getUserFiles, resolveShareLink, searchFiles, sendLinkEmail, showUserFiles, updateAllFileExpiry, updateFileExpiry, updateFilePassword, updateFileStatus, uploadFiles, verifyFilePassword, uploadFilesGuest, guestDownloadInfo, verifyGuestFilePassword ,  } from "../controllers/file.controller.js";


const router=Router();

const handleUpload = (uploadMiddleware, handler) => [
  (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  handler,
];

router.post("/upload", ...handleUpload(upload.array("files"), uploadFiles));
router.post("/upload-guest", ...handleUpload(upload.array("files"), uploadFilesGuest));

router.get("/download/:fileId",downloadFile);
router.delete("/delete/:fileId",deleteFile);
router.put("/update/:fileId",updateFileStatus);
router.get("/getFileDetails/:fileId",getFileDetails);
router.post('/generateShareShortenLink', generateShareShortenLink);
router.post('/sendLinkEmail', sendLinkEmail);

router.post('/FileExpiry', updateFileExpiry);
router.post('/updateAllFileExpiry', updateAllFileExpiry);
router.post('/updateFilePassword', updateFilePassword);
router.get('/searchFiles', searchFiles);
router.get('/showUserFiles', showUserFiles);

router.get('/generateQR/:fileId', generateQR);
router.get('/getDownloadCount/:fileId', getDownloadCount);

router.get('/f/:shortCode',downloadInfo);
router.get('/g/:shortCode',guestDownloadInfo);

router.get('/resolveShareLink/:code', resolveShareLink);
router.post('/verifyFilePassword', verifyFilePassword);
router.post('/verifyGuestFilePassword', verifyGuestFilePassword);

router.get('/getUserFiles/:userId', getUserFiles);






export default router;