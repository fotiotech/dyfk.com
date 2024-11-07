"use client";

import { AdminLayout } from "@/components";
import { useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, useState } from "react";
import { postHeroContent } from "../../../../fetch/Home";

const AddHeroContent = () => {
  const [heroData, setHeroData] = useState({
    title: "",
    description: "",
    cta_text: "",
    cta_link: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  function handleHeroDataChanges(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setHeroData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  }

  const mutation = useMutation({
    mutationFn: (data: FormData) => postHeroContent(data),
  });

  const handleSubmitData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    

    const data = new FormData();
    Object.entries(heroData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (imageFile) {
      data.append("imageUrl", imageFile);
    }

    mutation.mutate(data);
  };

  return (
    <>
      <div>
        <h2>Add Hero Content</h2>
      </div>
      <form onSubmit={handleSubmitData}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            name="title"
            value={heroData.title}
            onChange={handleHeroDataChanges}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            name="description"
            value={heroData.description}
            onChange={handleHeroDataChanges}
          />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            id="imageUrl"
            type="file"
            accept=".png, .jpg, .jpeg, .webp, .mp4"
            name="imageUrl"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="cta_text">CTA Text:</label>
          <input
            id="cta_text"
            type="text"
            name="cta_text"
            value={heroData.cta_text}
            onChange={handleHeroDataChanges}
          />
        </div>
        <div>
          <label htmlFor="cta_link">CTA Link:</label>
          <input
            id="cta_link"
            type="text"
            name="cta_link"
            value={heroData.cta_link}
            onChange={handleHeroDataChanges}
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
