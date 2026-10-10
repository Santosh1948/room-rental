import { useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2, Plus, Trash2, UploadCloud } from "lucide-react";

import api from "../api/axios";

const ImageUploader = ({
    endpoint,
    existingImages = [],
    onChange,
    label = "Images",
    maxFiles = 5,
    multiple = true,
}) => {
    const inputRef = useRef(null);
    const [images, setImages] = useState(existingImages || []);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setImages(existingImages || []);
    }, [existingImages]);

    const handleUpload = async (event) => {
        const chosenFiles = Array.from(event.target.files || []);

        if (!chosenFiles.length) {
            return;
        }

        if (!endpoint) {
            setError("Upload endpoint is not configured for this uploader.");
            event.target.value = "";
            return;
        }

        if (images.length + chosenFiles.length > maxFiles) {
            setError(`You can upload up to ${maxFiles} images.`);
            event.target.value = "";
            return;
        }

        const formData = new FormData();

        chosenFiles.forEach((file) => {
            formData.append(multiple ? "images" : "image", file);
        });

        try {
            setUploading(true);
            setError("");

            const response = await api.post(endpoint, formData);
            const uploadedImages = response.data?.images || [];

            if (!uploadedImages.length && response.data?.imageUrl) {
                uploadedImages.push(response.data.imageUrl);
            }

            const nextImages = [...images, ...uploadedImages];
            setImages(nextImages);
            onChange?.(nextImages);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Image upload failed. Please try again."
            );
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const removeImage = (imageUrl) => {
        const nextImages = images.filter((image) => image !== imageUrl);
        setImages(nextImages);
        onChange?.(nextImages);
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <ImageIcon size={18} />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            {label}
                        </p>
                        <p className="text-xs text-slate-500">
                            Up to {maxFiles} images
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading || images.length >= maxFiles}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {uploading ? (
                        <Loader2 size={15} className="animate-spin" />
                    ) : (
                        <Plus size={15} />
                    )}
                    {uploading ? "Uploading..." : "Add"}
                </button>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleUpload}
                className="hidden"
            />

            {error && (
                <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                </div>
            )}

            {images.length === 0 ? (
                <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center">
                    <div>
                        <UploadCloud className="mx-auto mb-2 text-slate-400" size={22} />
                        <p className="text-sm text-slate-500">
                            No images uploaded yet.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((image, index) => (
                        <div
                            key={`${image}-${index}`}
                            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white"
                        >
                            <img
                                src={image}
                                alt={`Upload ${index + 1}`}
                                className="h-24 w-full object-cover"
                            />

                            <button
                                type="button"
                                onClick={() => removeImage(image)}
                                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-slate-900"
                                title="Remove image"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
