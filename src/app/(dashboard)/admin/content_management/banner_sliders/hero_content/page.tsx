"use client";

import { findHeroContent } from "@/app/actions/content_management";
import { HeroSection } from "@/constant/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const HeroContent = () => {
  const [heroContent, setHeroContent] = useState<HeroSection[] | null>([]);

  useEffect(() => {
    async function getHeroContent() {
      const content = await findHeroContent();
      if (content) {
        setHeroContent(content);
      }
    }
    getHeroContent();
  }, []);
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className=" font-bold text-lg">Hero Content</h2>
        <Link href={"/admin/settings/add_hero_content"}>
          <button type="button" className="p-2 rounded-lg bg-thiR">
            Add Hero Content
          </button>
        </Link>
      </div>
      <ul className="flex flex-col gap-3 mt-4">
        {heroContent &&
          heroContent.map((hero, index) => (
            <li key={index} className="flex gap-3 rounded-lg">
              <img
                title="hero"
                src={hero.imageUrl}
                width={50}
                height={50}
                alt="hero"
              />
              <span>{hero.title}</span>
            </li>
          ))}
      </ul>
    </>
  );
};

export default HeroContent;
