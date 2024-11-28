import Image from "next/image";
import React from "react";

interface imageRendererProps {
  image?: string;
}

const ImageRenderer = ({ image }: imageRendererProps) => {
  const renderImage = () => {
    if (image?.includes(".png")) {
      return (
        <Image
          title="image"
          src={image}
          width={500}
          height={500}
          alt="image"
          loading="lazy"
          className="w-full h-full object-contain p-2 "
        />
      );
    } else if (image?.includes(".jpg") || image?.includes(".jpeg")) {
      return (
        <Image
          title="image"
          src={image}
          width={500}
          height={500}
          alt="image"
          className="w-full h-full object-cover "
        />
      );
    } else if (image?.includes(".webp") || image?.includes(".avif")) {
      return (
        <Image
          title="image"
          src={image}
          width={500}
          height={500}
          alt="image"
          className="w-full h-full object-cover "
        />
      );
    }
    return undefined;
  };
  return renderImage();
};

export default ImageRenderer;
