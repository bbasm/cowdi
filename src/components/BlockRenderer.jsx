import React from "react";
import ImageBlock from "./ImageBlock";
import CodeBlock from "./CodeBlock";

const BlockRenderer = ({ block }) => {
  const defaultParagraphPadding = {
    top: "pt-0",
    bottom: "pb-0",
  };

  const {
    subtitle,
    image,
    imagePosition = "right",
    imageSize = "w-full",
    contentOrder = [
      "paragraphs",
      "littleParagraphs",
      "codeSnippets",
      "listItems",
      "paragraphsAfterCode",
      "specialText",
    ],
    paragraphs = [],
    littleParagraphs = [],
    codeSnippets = [],
    listItems = [],
    paragraphsAfterCode = [],
    specialText = [],
    paragraphPadding = {},
    paragraphMargin = {},
    littleParagraphPadding = {},
    littleParagraphMargin = {},
    specialTextMargin = {},
  } = block;

  const isSpecialCase = subtitle?.toLowerCase().includes("hati-hati");

  // Render different content types
  const renderContent = (contentType) => {
    switch (contentType) {
      case "paragraphs":
        return paragraphs.map((p, i) => (
          <p
            key={`p-${i}`}
            className={`text-[#66BAEF] md:text-lg ${
              paragraphPadding.top || ""
            } ${paragraphPadding.bottom || ""} ${paragraphMargin.top || ""} ${
              paragraphMargin.bottom || ""
            }`}
          >
            {p}
          </p>
        ));

      case "littleParagraphs":
        return (
          <div key="little-p">
            {littleParagraphs.map((p, i) => (
              <p
                key={`lp-${i}`}
                className={`text-[#66BAEF] md:text-lg ${
                  littleParagraphPadding.top || ""
                } ${littleParagraphPadding.bottom || ""} ${
                  littleParagraphMargin.top || ""
                } ${littleParagraphMargin.bottom || ""}
          `}
              >
                {p}
              </p>
            ))}
          </div>
        );

      case "codeSnippets":
        return codeSnippets.map((snipp) => (
          <CodeBlock key={snipp.id} snippet={snipp} />
        ));
      case "listItems":
        return (
          listItems.length > 0 && (
            <ul
              className={`list-disc pl-5 space-y-2 ${
                isSpecialCase ? "" : "text-[#66BAEF] md:text-lg"
              }`}
            >
              {listItems.map((li, i) => (
                <li key={`li-${i}`} dangerouslySetInnerHTML={{ __html: li }} />
              ))}
            </ul>
          )
        );
      case "paragraphsAfterCode":
        return paragraphsAfterCode.map((p, i) => (
          <p key={`pac-${i}`} className="mt-4 md:text-lg text-[#66BAEF]">
            {p}
          </p>
        ));
      case "specialText":
        return specialText.map((p, i) => (
          <div
            key={`st-${i}`}
            className={`bg-[#E0F3FA] text-[#3D83AC] px-4 py-2 rounded-md w-fit block ${
              specialTextMargin.top || ""
            } ${specialTextMargin.bottom || ""}`}
          >
            {p}
          </div>
        ));

      default:
        return null;
    }
  };

  // Split content into what goes beside image vs full-width
  const getContentGroups = () => {
    let beforeCode = [];
    let afterCode = [];
    let foundCode = false;

    contentOrder.forEach((type) => {
      if (type === "codeSnippets") foundCode = true;
      foundCode ? afterCode.push(type) : beforeCode.push(type);
    });

    return { beforeCode, afterCode };
  };

  const { beforeCode, afterCode } = getContentGroups();

  return (
    <div className="mb-15 px-4">
      {/* Title */}
      {subtitle && (
        <h2 className="text-2xl font-bold mb-4 text-[#3D83AC]">{subtitle}</h2>
      )}

      {/* Content with image */}
      {image && (
        <div
          className={`flex flex-col md:flex-row ${
            imagePosition === "left" ? "" : "md:flex-row-reverse"
          } gap-6 mb-6`}
        >
          {/* Image container */}
          <div
            className={`md:w-1/2 ${imageSize} flex justify-center md:justify-start`}
          >
            <ImageBlock
              image={image}
              subtitle={subtitle}
              imageSize={imageSize}
            />
          </div>

          {/* Text content */}
          <div className="md:w-1/2 text-[#66BAEF] md:text-lg space-y-4">
            {beforeCode.map((type) => renderContent(type))}
          </div>
        </div>
      )}

      {/* Content without image */}
      {!image && beforeCode.length > 0 && (
        <div className="text-[#66BAEF] md:text-lg mb-6">
          {beforeCode.map((type) => renderContent(type))}
        </div>
      )}

      {/* Full-width content (code snippets etc) */}
      {afterCode.length > 0 && (
        <div className="text-[#66BAEF] md:text-lg space-y-4">
          {afterCode.map((type) => renderContent(type))}
        </div>
      )}
    </div>
  );
};

export default BlockRenderer;
