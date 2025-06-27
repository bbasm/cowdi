import React from "react";

const ImageBlock = ({ image, subtitle, imageSize = "w-48" }) => {
  // Construct the path to the public folder manually
  const imageSrc = `/assets/${image}`;

  return (
    <div className=" -pt-6">
      <img
        src={imageSrc}
        alt={subtitle}
        className={`${imageSize} h-auto object-contain`}
      />
    </div>
  );
};

export default ImageBlock;
