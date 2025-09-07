import React from "react";

const ImageBlock = ({ image, subtitle, imageSize = "w-48" }) => {
  const imageSrc = `/assets/${image}`;
  const isVideo = image.endsWith('.MP4') || image.endsWith('.mp4');

  return (
    <div className=" -pt-6">
      {isVideo ? (
        <video
          src={imageSrc}
          alt={subtitle}
          autoPlay
          loop
          muted
          playsInline
          className={`${imageSize} h-auto object-contain`}
        />
      ) : (
        <img
          src={imageSrc}
          alt={subtitle}
          className={`${imageSize} h-auto object-contain`}
        />
      )}
    </div>
  );
};

export default ImageBlock;
