// components/ImageDropzone.tsx
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

interface filesUploaderProps {
  images?: File[];
  setImages: (arg: (img: File[]) => File[]) => void;
}

const FilesUploader: React.FC<filesUploaderProps> = ({ images, setImages }) => {
  const inputRef = useRef<HTMLInputElement | null>(null); // Reference to the hidden input element

  // Handler when files are dropped or selected
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImages((prevImages) => [...prevImages, ...acceptedFiles]);
    },
    [setImages]
  );

  // File validation function (optional)
  const validateFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, PNG, and GIF images are allowed.");
      return false;
    }
    return true;
  };

  // Setting up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: true,
    // validator: validateFile,
  });

  // Trigger file input click programmatically
  const handleClick = () => {
    inputRef.current?.click();
  };

  // Handler to remove an image
  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="border-gray-600 border-2
     hover:border-thiR p-4 my-2 rounded-md 
     text-center">
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
          <p>
            Drag and drop some images here, or click the button below to select
            files
          </p>
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

      {/* Thumbnails of uploaded images */}
      <div
        className="whitespace-nowrap overflow-x-auto 
      scrollbar-none mt-4"
      >
        {images?.map((file, index) => (
          <div key={index} className="relative inline-block mx-2">
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              width={50}
              height={50}
              className="h-20 w-20 object-cover rounded-md"
            />
            <button
              title="button"
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 text-white rounded-full p-1 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesUploader;
