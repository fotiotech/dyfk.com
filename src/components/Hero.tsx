"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HeroSection } from "@/constant/types";
import { findHeroContent } from "@/app/actions/content_management";

const HeaderScroll = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % heroContent?.length!
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [currentImageIndex, heroContent?.length]);

  const dotIndex = (index: number) => {
    setCurrentImageIndex(index % heroContent?.length!);
  };

  return (
    <div className="relative bg-pri">
      <div
        className=" bg-[#eee] transition-opacity
          duration-300 whitespace-nowrap overflow-hidden "
      >
        {
          heroContent?.length! > 0
            ? heroContent?.slice(0, 6).map((hero, index) => (
                <div
                  key={index}
                  className={` inline-block  w-full h-60 md:h-72 lg:h-screen  transition-transform 
                 ease-in-out duration-700
                `}
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  <Link href={hero.cta_link}>
                    <div
                      className="w-full h-full bg-cover bg-center "
                      style={{ backgroundImage: `url(${hero.imageUrl})` }}
                    >
                      <div className=" flex flex-col bg-sec bg-opacity-10 h-full p-10">
                        <h1 className="w-52 whitespace-normal font-bold text-2xl line-clamp-3">
                          {hero.title === "Enjoy Up to 25% off" && (
                            <p className="text-white">{hero.title}</p>
                          )}
                        </h1>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            : null // <Spinner loading={isLoading} />
        }
      </div>
      <div className="absolute bottom-0 flex justify-end items-center gap-4 w-full h-10 px-10 ">
        {heroContent &&
          heroContent?.map((hero, index) => (
            <span
              key={index}
              onClick={() => dotIndex(index)}
              className={`${
                index === currentImageIndex ? "bg-thiR" : "bg-[#eee]"
              } cursor-pointer p-1 rounded-full transition-all duration-300 `}
            ></span>
          ))}
      </div>
    </div>
  );
};

export default HeaderScroll;
