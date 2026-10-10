const { imagekit, isImageKitConfigured } = require("../config/imagekit");

const sanitizeFileName = (fileName = "upload") =>
    String(fileName)
        .trim()
        .replace(/[^a-zA-Z0-9_.-]/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase();

const uploadFileToImageKit = async ({ file, folder = "/roomly" }) => {
    if (!file) {
        throw new Error("No file provided for upload.");
    }

    if (!isImageKitConfigured) {
        throw new Error(
            "ImageKit is not configured. Please configure IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in the backend environment."
        );
    }

    const fileName = `${Date.now()}-${sanitizeFileName(file.originalname || "upload")}`;

    return new Promise((resolve, reject) => {
        imagekit.upload(
            {
                file: file.buffer,
                fileName,
                folder,
                useUniqueFileName: true,
            },
            (error, result) => {
                if (error) {
                    reject(new Error(error.message || "Image upload failed."));
                    return;
                }

                resolve(result);
            }
        );
    });
};

const deleteFileFromImageKit = async (fileId) => {
    if (!fileId || !isImageKitConfigured) {
        return false;
    }

    return new Promise((resolve) => {
        imagekit.deleteFile(fileId, (error) => {
            if (error) {
                console.warn("ImageKit delete failed:", error.message || error);
                resolve(false);
                return;
            }

            resolve(true);
        });
    });
};

module.exports = {
    uploadFileToImageKit,
    deleteFileFromImageKit,
    sanitizeFileName,
};
