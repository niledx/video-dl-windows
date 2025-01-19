const express = require("express");
const youtubedl = require("youtube-dl-exec");

const app = express();
const PORT = 3000
 
app.get("/download-youtube", async (req, res) => {
  const { videoUrl } = req.query;

  if (!videoUrl) {
    return res.status(400).json({ error: "Missing YouTube video URL." });
  }

  try {
    res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);
    res.setHeader("Content-Type", "video/mp4");

    const videoStream = youtubedl.exec(videoUrl, {
      output: "-", // Output to stdout
      format: "b", // Download the best video and audio separately
    //   mergeOutput: true, // Let yt-dlp merge video and audio
    });

    videoStream.stdout.pipe(res);

    videoStream.stderr.on("data", (data) => {
      console.error(`Error: ${data.toString()}`);
    });

    videoStream.on("close", () => {
      console.log("Video streaming completed.");
    });
  } catch (error) {
    console.error("Error downloading video:", error.message);
    res.status(500).json({ error: "Failed to download video.", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
