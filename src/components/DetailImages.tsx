import React, { useEffect, useState } from "react";
import ImageRenderer from "./ImageRenderer";

interface DetailImagesProps {
  file?: [string];
}

const DetailImages: React.FC<DetailImagesProps> = ({ file }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const slideToIndex = (direction: "left" | "right") => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex =
        direction === "right"
          ? (prevIndex + 1) % file?.length!
          : (prevIndex - 1 + file?.length!) % file?.length!;

      return newIndex;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % file?.length!);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentImageIndex, file?.length!]);

  const dotIndex = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div
      className="relative 
        py-3 "
    >
      <div
        className="absolute z-10 flex justify-between items-center
          lg:px-4 p-2 bottom-1/2 opacity-50 left-0 w-full"
      >
        <img
          title="Click left"
          src="/271220.png"
          onClick={() => slideToIndex("left")}
          className=" lg:w-8 lg:h-8 w-3 cursor-pointer h-3"
        />
        <img
          title="Click right"
          src="/271228.png"
          onClick={() => slideToIndex("right")}
          className="  lg:w-8 lg:h-8 w-3 cursor-pointer h-3"
        />
      </div>
      <div className=" whitespace-nowrap bg-[#eee] transition-all duration-300  overflow-hidden">
        {file &&
          file.map((image, index) => (
            <div
              key={index}
              className="inline-block  w-full "
              style={{
                transform: `translateX(-${currentImageIndex * 100}%)`,
              }}
            >
              <ImageRenderer image={image} />
            </div>
          ))}
      </div>
      <div className=" flex justify-center items-center gap-4 w-full h-14 bg-sec opacity-30">
        {file &&
          file.map((image, index) => (
            <span
              key={index}
              onClick={() => dotIndex(index)}
              className={`${
                index === currentImageIndex ? "bg-thi" : "bg-[#eee]"
              } cursor-pointer p-1 rounded-full transition-all duration-300 `}
            ></span>
          ))}
      </div>
    </div>
  );
};

export default DetailImages;
