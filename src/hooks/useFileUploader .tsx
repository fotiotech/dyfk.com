import { useState, useCallback, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/utils/firebaseConfig";

export const useFileUploader = (initialFiles: string[] = []) => {
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<string[]>(initialFiles);
  const [loading, setLoading] = useState(false);

  const upload = useCallback(async () => {
    if (imgFiles.length === 0) return;

    setLoading(true);
    const urls: string[] = [];

    for (const file of imgFiles) {
      try {
        const storageRef = ref(storage, `uploads/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        urls.push(downloadURL);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setFiles((prev) => [...prev, ...urls]);
    setImgFiles([]);
    setLoading(false);
  }, [imgFiles]);

  useEffect(() => {
    if (imgFiles.length > 0) {
      upload();
    }
  }, [upload]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addFiles = (newFiles: File[]) => {
    setImgFiles((prev) => [...prev, ...newFiles]);
  };

  return {
    files,
    loading,
    addFiles,
    removeFile,
  };
};
