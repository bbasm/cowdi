import React from "react";
import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";
import CodeBlock from "./CodeBlock";

const BlockRenderer = ({ block }) => {
  const {
    subtitle,
    image,
    imagePosition = "right",
    paragraphs = [],
    codeSnippets = [],
    listItems,
    paragraphsAfterCode = [],
  } = block;

  const isSpecialCase = subtitle.toLowerCase().includes("hati-hati");

  const textContent = (
    <div
      className={`${
        image ? "md:w-1/2" : "w-full"
      } text-[#66BAEF] md:text-lg space-y-4`}
    >
      {/* Always render inside for image case */}
      {image && (
        <h2 className="text-2xl font-bold mb-4 text-[#3D83AC]">{subtitle}</h2>
      )}

      {isSpecialCase && listItems && (
        <ul className="list-disc pl-5 space-y-2">
          {listItems.map((li, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: li }} />
          ))}
        </ul>
      )}

      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      {!isSpecialCase && listItems && (
        <ul className="list-disc pl-5 space-y-2">
          {listItems.map((li, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: li }} />
          ))}
        </ul>
      )}
    </div>
  );

  const imageContent = image && (
    <div className="md:w-1/2 w-full flex justify-center md:justify-start items-start">
      <ImageBlock
        image={image}
        subtitle={subtitle}
        imageSize={block.imageSize}
      />
    </div>
  );

  return (
    <div className="mb-15 px-4">
      {/* Subtitle shown outside only when no image */}
      {!image && (
        <h2 className="text-2xl font-bold mb-4 text-[#3D83AC]">{subtitle}</h2>
      )}

      {image ? (
        <div
          className={`flex flex-col md:flex-row ${
            imagePosition === "left" ? "md:flex-row-reverse" : ""
          } items-start gap-14`}
        >
          {imageContent}
          {textContent}
        </div>
      ) : (
        <div className="w-full">{textContent}</div>
      )}

      {codeSnippets.map((snipp) => (
        <CodeBlock key={snipp.id} snippet={snipp} />
      ))}

      {paragraphsAfterCode.map((p, i) => (
        <p key={i} className="mt-4 md:text-lg text-[#66BAEF]">
          {p}
        </p>
      ))}
    </div>
  );
};

export default BlockRenderer;
