"use client";

import { createHeroContent } from "@/app/actions/content_management";
import FilesUploader from "@/components/FilesUploader";
import React, { useState } from "react";

const AddHeroContent = () => {

  const [imageFile, setImageFile] = useState<string[]>([]);

  const files = imageFile?.length! > 1 ? imageFile : imageFile?.[0];

  const toCreateHeroContent = createHeroContent.bind(null,files as string[])



  return (
    <>
      <div>
        <h2>Add Hero Content</h2>
      </div>
      <FilesUploader files={imageFile} setFiles={setImageFile} />
      <form action={toCreateHeroContent}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            name="title"
    
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            name="description"
           
          />
        </div>
        
        <div>
          <label htmlFor="cta_text">CTA Text:</label>
          <input
            id="cta_text"
            type="text"
            name="cta_text"
            
          />
        </div>
        <div>
          <label htmlFor="cta_link">CTA Link:</label>
          <input
            id="cta_link"
            type="text"
            name="cta_link"
           
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
