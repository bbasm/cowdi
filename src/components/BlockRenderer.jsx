import React from "react";
import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";
import CodeBlock from "./CodeBlock";

const BlockRenderer = ({ block }) => {
  const {
    type,
    subtitle,
    image,
    imagePosition = "right",
    contentOrder = [
      "paragraphs",
      "littleParagraphs",
      "codeSnippets",
      "listItems",
      "paragraphsAfterCode",
    ],
    paragraphs = [],
    littleParagraphs = [],
    codeSnippets = [],
    listItems = [],
    paragraphsAfterCode = [],
  } = block;

  // ❗️HANDLE SPECIAL BLOCK TYPES FIRST
  if (type === "image") {
    return (
      <div className="mb-15 px-4">
        <div
          className={`flex flex-col md:flex-row ${
            imagePosition === "left" ? "md:flex-row-reverse" : ""
          } items-start gap-14`}
        >
          <div className="md:w-1/2 w-full flex justify-center md:justify-start items-start">
            <ImageBlock
              image={image}
              subtitle={subtitle}
              imageSize={block.imageSize}
            />
          </div>
          <div className="md:w-1/2 text-[#66BAEF] md:text-lg space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-[#3D83AC]">
              {subtitle}
            </h2>
            {paragraphs.map((p, i) => (
              <p key={`p-${i}`}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "code" || type === "fix_code") {
    return (
      <div className="mb-15 px-4">
        <h2 className="text-2xl font-bold mb-4 text-[#3D83AC]">{subtitle}</h2>

        <div className="text-[#66BAEF] md:text-lg space-y-4">
          {paragraphs.map((p, i) => (
            <p key={`p-${i}`}>{p}</p>
          ))}

          {codeSnippets.map((snipp) => (
            <CodeBlock key={snipp.id} snippet={snipp} />
          ))}

          {listItems.length > 0 && (
            <ul className="list-disc pl-5 space-y-2 text-[#66BAEF] md:text-lg">
              {listItems.map((li, i) => (
                <li key={`li-${i}`} dangerouslySetInnerHTML={{ __html: li }} />
              ))}
            </ul>
          )}

          {paragraphsAfterCode.map((p, i) => (
            <p key={`pac-${i}`} className="mt-4 md:text-lg text-[#66BAEF]">
              {p}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // ❗️Fallback for type === "text" or others
  const isSpecialCase = subtitle.toLowerCase().includes("hati-hati");

  const renderContent = (type) => {
    switch (type) {
      case "paragraphs":
        return paragraphs.map((p, i) => <p key={`p-${i}`}>{p}</p>);
      case "littleParagraphs":
        return (
          <div key="little-p" className="space-y-1 text-[#66BAEF]">
            {littleParagraphs.map((p, i) => (
              <p key={`lp-${i}`}>{p}</p>
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
              key="list"
              className="list-disc pl-5 space-y-2 text-[#66BAEF] md:text-lg"
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
      default:
        return null;
    }
  };

  const textContent = (
    <div
      className={`${
        image ? "md:w-1/2" : "w-full"
      } text-[#66BAEF] md:text-lg space-y-4`}
    >
      {image && (
        <h2 className="text-2xl font-bold mb-4 text-[#3D83AC]">{subtitle}</h2>
      )}

      {isSpecialCase && listItems.length > 0 && (
        <ul className="list-disc pl-5 space-y-2">
          {listItems.map((li, i) => (
            <li
              key={`special-li-${i}`}
              dangerouslySetInnerHTML={{ __html: li }}
            />
          ))}
        </ul>
      )}

      {!isSpecialCase &&
        contentOrder.map((type, i) => (
          <React.Fragment key={i}>{renderContent(type)}</React.Fragment>
        ))}
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
    </div>
  );
};

export default BlockRenderer;
