export function uploadMedia(req, res) {
  res.status(201).json({
    fileUrl: `/uploads/${req.file.filename}`
  });
}
