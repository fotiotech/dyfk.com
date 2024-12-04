"use client";

import { createHeroContent } from "@/app/actions/content_management";
import FilesUploader from "@/components/FilesUploader";
import { useFileUploader } from "@/hooks/useFileUploader ";
import React, { useState } from "react";

const AddHeroContent = () => {
  const { files, loading, addFiles, removeFile } = useFileUploader();

  const file = files?.length! > 1 ? files : files?.[0];

  const toCreateHeroContent = createHeroContent.bind(null, file as string[]);

  return (
    <>
      <div>
        <h2>Add Hero Content</h2>
      </div>
      <div>
        {files.length > 0 && (
          <div className="flex flex-wrap">
            <h4>Uploaded Images</h4>
            {files.map((file, index) => (
              <div key={index}>
                <img
                  src={file}
                  alt={`Uploaded file ${index + 1}`}
                  width={100}
                />
                <button onClick={() => removeFile(index)}>Remove</button>
              </div>
            ))}
          </div>
        )}
        <FilesUploader />
      </div>
      <form action={toCreateHeroContent}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            name="title"
            className="bg-transparent"
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            name="description"
            className="bg-transparent"
          />
        </div>

        <div>
          <label htmlFor="cta_text">CTA Text:</label>
          <input
            id="cta_text"
            type="text"
            name="cta_text"
            className="bg-transparent"
          />
        </div>
        <div>
          <label htmlFor="cta_link">CTA Link:</label>
          <input
            id="cta_link"
            type="text"
            name="cta_link"
            className="bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="border px-3 py-1 bg-thiR rounded-lg font-semibold"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default AddHeroContent;
