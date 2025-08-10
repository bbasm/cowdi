import React from "react";
import ImageBlock from "./ImageBlock";
import CodeBlock from "./CodeBlock";

const BlockRenderer = ({ block, lessonNum }) => {
  const {
    subtitle,
    image,
    imagePosition = "right",
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

  // 👇 Smart responsive image size
  const getImageSize = (img) => {
    const isSpecial = img === "duck.png" || img === "warning.png";

    return isSpecial
      ? "w-[180px] sm:w-[240px] md:w-[280px] lg:w-[320px] xl:w-[280px] 2xl:w-[280px]"
      : "w-[180px] sm:w-[240px] md:w-[280px] lg:w-[360px] xl:w-[420px]";
  };

  // 👇 Handle each block content type
  const renderContent = (type) => {
    switch (type) {
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
        return littleParagraphs.map((p, i) => (
          <p
            key={`lp-${i}`}
            className={`text-[#66BAEF] md:text-lg ${
              littleParagraphPadding.top || ""
            } ${littleParagraphPadding.bottom || ""} ${
              littleParagraphMargin.top || ""
            } ${littleParagraphMargin.bottom || ""}`}
          >
            {p}
          </p>
        ));

      case "codeSnippets":
        return codeSnippets.map((snippet, i) => (
          <CodeBlock 
            key={snippet.id || `code-${i}`} 
            snippet={snippet} 
            lessonNum={lessonNum} 
            optionalMessage={block.optionalMessage}
          />
        ));

      case "listItems":
        return listItems.length > 0 ? (
          <div className="mb-6">
            <ul
              className={`list-disc pl-5 space-y-2 ${
                isSpecialCase ? "" : "text-[#66BAEF] md:text-lg"
              }`}
            >
              {listItems.map((li, i) => {
                const isString = typeof li === "string";
                const content = isString ? li : li.text;
                const paddingClass = isString ? "" : li.padding || "";
                return (
                  <li
                    key={`li-${i}`}
                    className={paddingClass}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                );
              })}
            </ul>
          </div>
        ) : null;

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

  // 👇 Split content around code snippets
  const getContentGroups = () => {
    const beforeCode = [];
    const afterCode = [];
    let foundCode = false;

    contentOrder.forEach((type) => {
      if (type === "codeSnippets") foundCode = true;
      if (foundCode) {
        afterCode.push(type);
      } else {
        beforeCode.push(type);
      }
    });

    return { beforeCode, afterCode };
  };

  const { beforeCode, afterCode } = getContentGroups();

  return (
    <div className="mb-16 px-4">
      {/* Subtitle */}
      {subtitle && (
        <h2 className="text-2xl font-bold mb-4 text-[#3D83AC]">{subtitle}</h2>
      )}

      {/* IMAGE + TEXT SIDE BY SIDE */}
      {image && (
        <div
          className={`flex flex-col md:flex-row ${
            imagePosition === "left" ? "" : "md:flex-row-reverse"
          } gap-6 mb-6`}
        >
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <ImageBlock
              image={image}
              subtitle={subtitle}
              imageSize={getImageSize(image)}
            />
          </div>

          <div className="w-full md:w-1/2 text-[#66BAEF] md:text-lg space-y-4">
            {beforeCode.map((type) => renderContent(type))}
          </div>
        </div>
      )}

      {/* TEXT ONLY (NO IMAGE) */}
      {!image && beforeCode.length > 0 && (
        <div className="text-[#66BAEF] md:text-lg mb-6 space-y-4">
          {beforeCode.map((type) => renderContent(type))}
        </div>
      )}

      {/* FULL WIDTH CONTENT (e.g. Code IDEs, Extra Text) */}
      {afterCode.length > 0 && (
        <div className="text-[#66BAEF] md:text-lg space-y-4">
          {afterCode.map((type) => renderContent(type))}
        </div>
      )}
    </div>
  );
};

export default BlockRenderer;
