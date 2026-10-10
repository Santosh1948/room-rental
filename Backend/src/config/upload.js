const multer = require("multer");

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5,
    },
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            return cb(
                new Error("Only JPG, JPEG, PNG, and WEBP image files are allowed.")
            );
        }

        cb(null, true);
    },
});

module.exports = { upload, ALLOWED_IMAGE_TYPES };
