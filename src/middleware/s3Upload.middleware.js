const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");

const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,

    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, `uploads/${fileName}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Only JPEG, PNG and WebP images are allowed");

      error.statusCode = 400;
      error.isOperational = true;

      return cb(error);
    }

    cb(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadS3;
