import Image from "next/image";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { AttachFile } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { storage } from "@/utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Spinner from "./Spinner";

interface FilesUploaderProps {
  files?: string[]; // Allow files to be undefined, and it defaults to an empty array
  setFiles: (arg: string[]) => void;
}

const FilesUploader: React.FC<FilesUploaderProps> = ({
  files = [], // Default to an empty array if files is undefined
  setFiles,
}) => {
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Function to handle image upload to Firebase
  const upload = useCallback(async () => {
    if (imgFiles.length === 0) return;

    setLoading(true);
    const urls: string[] = [];

    for (const file of imgFiles) {
      if (!file || !file.name) {
        console.error("Invalid file detected:", file);
        continue;
      }

      try {
        const storageRef = ref(storage, `uploads/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        urls.push(downloadURL);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setFiles([...(files as []), ...urls]);
    setImgFiles([]);
    setLoading(false);
  }, [imgFiles, setFiles, files]);

  // Trigger the upload only once when imgFiles change
  useEffect(() => {
    if (imgFiles.length > 0) {
      upload();
    }
  }, [upload]);

  // Handler when files are dropped or selected
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImgFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  // Setting up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: true,
  });

  // Trigger file input click programmatically
  const handleClick = () => {
    inputRef.current?.click();
  };

  // Handler to remove an image
  const removeImage = (index: number) => {
    const updatedFiles = [...(files as [])]; // Spread files to ensure it's a new array
    updatedFiles.splice(index, 1); // Remove the image by index
    setFiles(updatedFiles);
  };

  return (
    <div className="whitespace-nowrap w-full overflow-clip overflow-x-auto scrollbar-none my-4 space-x-3">
      {/* Thumbnails of uploaded images */}
      {files?.length! > 0 &&
        files?.map((file, index) => (
          <div
            key={index}
            className="relative inline-block border-2 border-gray-600 w-44 h-56 rounded-md overflow-hidden"
          >
            {loading ? (
              <Spinner />
            ) : (
              <Image
                src={file}
                alt={`Uploaded file ${index + 1}`}
                width={500}
                height={500}
                className="h-full w-full object-cover"
              />
            )}

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
              title="Remove Image"
            >
              ✕
            </button>
          </div>
        ))}
      <div
        className={`${
          files?.length! > 0 ? "w-60 border-thiR" : "w-full border-gray-600"
        } border-2 h-56 align-top p-4 rounded-md text-center inline-block`}
      >
        {/* Drag-and-drop area */}
        <div
          {...getRootProps()}
          className={`p-6 ${
            isDragActive ? "border-blue-500" : "border-gray-400"
          }`}
        >
          <input {...getInputProps()} ref={inputRef} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <div>
              <AttachFile style={{ fontSize: 32 }} />
              <p className="text-wrap">Drag and drop some images here</p>
            </div>
          )}
        </div>

        {/* Clickable button to open file selection dialog */}
        <button
          title="button"
          type="button"
          onClick={handleClick}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Select Images
        </button>
      </div>
    </div>
  );
};

export default FilesUploader;
