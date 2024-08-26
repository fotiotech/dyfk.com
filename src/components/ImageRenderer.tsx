import React from "react";

interface imageRendererProps {
  image: string;
}

const ImageRenderer = ({ image }: imageRendererProps) => {
  const renderImage = () => {
    if (image.includes(".png")) {
      return (
        <img
          title="image"
          src={image}
          className="w-full h-full object-contain p-2 "
        />
      );
    } else if (image.includes(".jpg") || image.endsWith(".jpeg")) {
      return (
        <img
          title="image"
          src={image}
          className="w-full h-full object-cover "
        />
      );
    } else if (image.includes(".webp")) {
      return (
        <img
          title="image"
          src={image}
          className="w-full h-full object-cover "
        />
      );
    }
    return undefined;
  };
  return renderImage();
};

export default ImageRenderer;
