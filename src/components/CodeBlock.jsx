import React, { useState, useEffect, useRef } from "react";
import "../styles/codeblock.css";

const CodeBlock = ({ snippet }) => {
  const { id, starterCode, mustFix } = snippet;
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [fixed, setFixed] = useState(!mustFix);
  const [hasError, setHasError] = useState(false);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(id);
    if (saved) {
      setCode(saved);
      setHasUserEdited(true); // they've interacted before
    } else {
      // First time loading — add 1 empty line
      setCode(starterCode.endsWith("\n") ? starterCode : starterCode + "\n");
    }
  }, [id, starterCode]);

  useEffect(() => {
    autoResize();
  }, [code]);

  const run = () => {
    let result = "";
    try {
      // eslint-disable-next-line no-eval
      result = eval(code);
      setHasError(false);
      if (mustFix) setFixed(true);
    } catch (e) {
      result = e.message;
      setHasError(true);
      setFixed(false);
    }
    setOutput(result);
    localStorage.setItem(id, code);
  };

  const reset = () => {
    const initial = starterCode.endsWith("\n") ? starterCode : starterCode + "\n";
    setCode(initial);
    setOutput("");
    setFixed(!mustFix);
    setHasError(false);
    setHasUserEdited(false);
    localStorage.removeItem(id);
  };

  const getLineNumbers = () => {
    let lines = code.split("\n");

    // Only add extra line if not yet edited by user
    if (!hasUserEdited && lines[lines.length - 1] !== "") {
      lines.push(""); // simulate default extra line
    }

    return lines.map((_, i) => i + 1).join("\n");
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  return (
    <div className="mb-6 font-source text-base pt-6">
      {/* Top bar */}
      <div
        className={`flex justify-end items-center px-4 py-2.5 rounded-t-lg  ${
          hasError || (mustFix && !fixed) ? "bg-[#F2958C]" : "bg-[#BECD92]"
        }`}
      >
        <div className="flex gap-4">
          <button onClick={reset} title="Reset" className="w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
              <path fill="#3B3B3B" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6s-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8s-3.58-8-8-8" />
            </svg>
          </button>
          <button onClick={run} title="Run" className="w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
              <path fill="#3B3B3B" d="m6.192 3.67l13.568 7.633a.8.8 0 0 1 0 1.394L6.192 20.33A.8.8 0 0 1 5 19.632V4.368a.8.8 0 0 1 1.192-.697" />
            </svg>
          </button>
        </div>
      </div>

      {/* Code editor */}
      <div className="flex border rounded-b-lg overflow-hidden text-[16px] leading-[1.8]">
        {/* Line numbers */}
        <pre className="bg-white text-gray-400 px-4 py-3 text-right select-none font-source whitespace-pre">
          {getLineNumbers()}
        </pre>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="flex-1 p-3 font-source resize-none outline-none bg-white"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setHasUserEdited(true);
          }}
          spellCheck={false}
        />
      </div>

      {/* Output */}
      {output && (
        <pre className="bg-white mt-4 p-3 rounded-md border border-gray-300 font-source text-[16px] leading-6 whitespace-pre-wrap">
          {output}
        </pre>
      )}

      {/* Fix prompt */}
      {mustFix && !fixed && (
        <p className="text-yellow-500 mt-2 text-sm font-medium font-source">Perbaiki kode ini untuk melanjutkan ➤</p>
      )}
    </div>
  );
};

export default CodeBlock;
