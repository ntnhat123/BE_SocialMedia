import express from "express";
import multer from "multer";
import Video from "../model/video.js";
const router = express.Router();
const upload = multer({
  dest: "uploads/", // Set your desired upload directory
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only video files are allowed."));
    }
  },
});
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const videoFile = req.file;

    const video = new Video({
      filename: videoFile.filename,
      path: videoFile.path,
    });

    const savedVideo = await video.save();

    res.json({ message: "Video uploaded successfully", video: savedVideo });
  } catch (error) {
    console.error("Error uploading video", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/getVideo", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json({ videos });
  } catch (error) {
    console.error("Error fetching videos", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
