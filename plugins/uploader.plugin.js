const express = require("express");
const router = express.Router();
const multer = require('multer');
const fs = require("fs");
const path = require("path");

//UPLOADER AREA
// Menentukan lokasi dan nama file yang disimpan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/'); // folder tempat file akan disimpan
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // memberi nama file dengan timestamp
  }
});

const upload = multer({ storage: storage });

// Middleware untuk membuat folder 'uploads' jika belum ada
const uploadDir = './public';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Route untuk menerima permintaan POST dengan file gambar
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  // Membuat URL untuk mengunduh file
  const downloadUrl = `${req.protocol}://${req.headers.host}/${req.file.filename}`;

  // Mengatur penghapusan file setelah 5 menit (300.000 milidetik)
  setTimeout(() => {
    const filePath = path.join('public', req.file.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log(`File ${req.file.filename} has been deleted.`);
      }
    });
  }, 60000); // 60000 ms = 1 menit

  res.status(200).send({
    message: 'File uploaded successfully!',
    file: req.file,
    downloadUrl: downloadUrl  // Menambahkan link unduh di respons
  });
});

module.exports = {
  name: "Temp Image Uploader",
  description: "Uploader File Sementara",
  basePath: "",
  routes: [
    {
      method: "POST",
      path: "/upload",
      test: ""
    }
  ],
  router
};
