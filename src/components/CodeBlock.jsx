import React, { useState, useEffect, useRef } from "react";
import "../styles/codeblock.css";
import {
  runPython,
  isPyodideReady,
  loadPyodideInstance,
} from "../utils/pyodideRunner";
import {
  runTurtle,
  isTurtleReady,
  loadTurtleInstance,
} from "../utils/turtleRunner";

const CodeBlock = ({ snippet, lessonNum }) => {
  const { id, starterCode, mustFix } = snippet;
  const storageKey = `lesson${lessonNum}-${id}-${starterCode}`;

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [hasError, setHasError] = useState(false);
  const [fixed, setFixed] = useState(!mustFix);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [canvasData, setCanvasData] = useState(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setCode(saved);
      setHasUserEdited(true);
    } else {
      setCode(starterCode.endsWith("\n") ? starterCode : starterCode + "\n");
    }
  }, [storageKey, starterCode]);

  useEffect(() => {
    const warmUp = async () => {
      const isTurtleCode = code.includes('turtle') || code.includes('from turtle');
      
      if (isTurtleCode) {
        if (!isTurtleReady()) {
          await loadTurtleInstance();
        }
      } else {
        if (!isPyodideReady()) {
          await loadPyodideInstance();
        }
      }
      setPyodideReady(true);
    };

    warmUp();
  }, [code]);

  useEffect(() => {
    autoResize();
  }, [code]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  const getLineNumbers = () => {
    let lines = code.split("\n");
    if (!hasUserEdited && lines[lines.length - 1] !== "") {
      lines.push(""); // add default extra line if untouched
    }
    return lines.map((_, i) => i + 1).join("\n");
  };

  const run = async () => {
    if (!pyodideReady) {
      setOutput("⏳ Python belum siap! Tunggu sebentar ya...");
      return;
    }

    const isTurtleCode = code.includes('turtle') || code.includes('from turtle');
    
    if (isTurtleCode) {
      const result = await runTurtle(code);
      localStorage.setItem(storageKey, code);

      if (result.error) {
        setOutput(result.error);
        setHasError(true);
        setFixed(false);
        setCanvasData(null);
      } else {
        setOutput(result.output || "Kode berhasil dijalankan! Lihat gambar di bawah.");
        setHasError(false);
        setCanvasData(result.canvasData);
        if (mustFix) {
          setFixed(true);
        }
      }
    } else {
      const { output, error } = await runPython(code);
      localStorage.setItem(storageKey, code);

      if (error) {
        setOutput(error);
        setHasError(true);
        setFixed(false);
        setCanvasData(null);
      } else {
        setOutput(output);
        setHasError(false);
        setCanvasData(null);
        if (mustFix && output.trim()) {
          setFixed(true);
        }
      }
    }
  };

  const reset = () => {
    const initial = starterCode.endsWith("\n")
      ? starterCode
      : starterCode + "\n";
    setCode(initial);
    setOutput("");
    setFixed(!mustFix);
    setHasError(false);
    setHasUserEdited(false);
    setCanvasData(null);
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="mb-6 font-source text-base pt-2 text-black">
      {/* Top bar */}
      <div
        className={`flex justify-end items-center px-4 py-2.5 rounded-t-lg ${
          hasError || (mustFix && !fixed) ? "bg-[#F2958C]" : "bg-[#BECD92]"
        }`}
      >
        <div className="flex gap-4">
          <button onClick={reset} title="Reset" className="w-6 h-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
            >
              <path
                fill="#3B3B3B"
                d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6s-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8s-3.58-8-8-8"
              />
            </svg>
          </button>
          <div className="relative group">
            <button
              onClick={run}
              title={pyodideReady ? "Jalankan kode" : ""}
              className={`w-6 h-6 ${
                !pyodideReady ? "opacity-40 cursor-not-allowed" : ""
              }`}
              disabled={!pyodideReady}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#3B3B3B"
                  d="m6.192 3.67l13.568 7.633a.8.8 0 0 1 0 1.394L6.192 20.33A.8.8 0 0 1 5 19.632V4.368a.8.8 0 0 1 1.192-.697"
                />
              </svg>
            </button>

            {/* Tooltip when loading */}
            {!pyodideReady && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                ⏳ Tunggu sebentar... Komputernya masih siap-siap!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex border rounded-b-lg overflow-hidden text-[16px] leading-[1.8] bg-white text-black">
        <pre className="bg-white text-gray-400 px-4 py-3 text-right select-none font-source whitespace-pre">
          {getLineNumbers()}
        </pre>
        <textarea
          ref={textareaRef}
          className="flex-1 p-3 font-source resize-none outline-none bg-white text-black"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setHasUserEdited(true);
          }}
          spellCheck={false}
        />
      </div>

      {output && (
        <div className="bg-white mt-4 p-3 rounded-md border border-gray-300 text-[16px] leading-6 text-black">
          <pre
            className={
              output.startsWith("⏳")
                ? "font-[Poppins] italic text-gray-600"
                : "font-source"
            }
          >
            {output}
          </pre>
        </div>
      )}

      {/* Turtle Canvas */}
      {canvasData && (
        <div className="bg-white mt-4 p-3 rounded-md border border-gray-300 flex justify-center">
          <img 
            src={`data:image/svg+xml;base64,${canvasData}`} 
            alt="Turtle Graphics Output"
            className="max-w-full h-auto"
          />
        </div>
      )}

      {/* Fix prompt */}
      {mustFix && !fixed && (
        <p className="text-yellow-500 mt-2 text-sm font-medium font-source">
          Perbaiki kode ini untuk melanjutkan ➤
        </p>
      )}
    </div>
  );
};

export default CodeBlock;