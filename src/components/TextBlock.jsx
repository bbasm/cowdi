const TextBlock = ({ subtitle, paragraphs, listItems }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{subtitle}</h2>
      {paragraphs?.map((para, i) => (
        <p key={i} className="mb-4 ">
          {para}
        </p>
      ))}
      {listItems && (
        <ul className="list-disc pl-5 space-y-1">
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TextBlock;
