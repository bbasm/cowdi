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
import AnimatedTurtleCanvas from "./AnimatedTurtleCanvas";
import { setLesson5ValidationStatus, markExerciseCompleted } from "../utils/lessonProgress";
import { createValidationResult } from "../utils/requirementChecker";

// Global loading queue to manage progressive loading
let loadingQueue = [];
let isProcessingQueue = false;

const processLoadingQueue = async () => {
  if (isProcessingQueue || loadingQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (loadingQueue.length > 0) {
    const { isTurtleCode, resolve } = loadingQueue.shift();
    
    try {
      if (isTurtleCode) {
        await loadTurtleInstance();
      } else {
        await loadPyodideInstance();
      }
      resolve(true);
    } catch (error) {
      console.error("Failed to load environment:", error);
      resolve(true); // Still resolve to make button available
    }
    
    // Small delay between loading each component
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  isProcessingQueue = false;
};

const CodeBlock = ({ snippet, lessonNum }) => {
  const { id, starterCode, mustFix } = snippet;
  const storageKey = `lesson${lessonNum}-${id}-${starterCode}`;
  
  // Check if this is the lesson 5 validation exercise
  const isLesson5ValidationExercise = id === "python-hello-correct-5-6";
  
  // Check if this is the first turtle example that shouldn't be runnable (only python-correct-5-1)
  const isNonRunnableTurtleExample = id === "python-correct-5-1";

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [hasError, setHasError] = useState(false);
  const [fixed, setFixed] = useState(!mustFix && !isLesson5ValidationExercise);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [canvasData, setCanvasData] = useState(null);
  const [animationData, setAnimationData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  const textareaRef = useRef(null);
  
  // Check if this exercise has specific requirements (like lesson 5)
  const hasRequirements = ['python-correct-7-4', 'python-correct-6-5', 'python-correct-6-4'].includes(id);

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
    const isTurtleCode = code.includes('turtle') || code.includes('from turtle');
    
    // Check if already ready
    if ((isTurtleCode && isTurtleReady()) || (!isTurtleCode && isPyodideReady())) {
      setPyodideReady(true);
      return;
    }

    // Add to loading queue
    const loadingPromise = new Promise((resolve) => {
      loadingQueue.push({ isTurtleCode, resolve });
    });

    loadingPromise.then(() => {
      setPyodideReady(true);
    });

    // Start processing the queue
    processLoadingQueue();
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
        setAnimationData(null);
      } else {
        setOutput(result.output || "Kode berhasil dijalankan! Lihat animasi di bawah.");
        setHasError(false);
        
        // Handle new animation format
        if (result.canvasData && result.canvasData.commands) {
          setCanvasData(null);
          setAnimationData(result.canvasData);
          
          // Handle lesson 5 validation
          if (isLesson5ValidationExercise && result.canvasData.validation) {
            setValidationResult(result.canvasData.validation);
            if (result.canvasData.validation.valid) {
              setFixed(true);
              setLesson5ValidationStatus(true); // Save progress
            } else {
              setFixed(false);
              setLesson5ValidationStatus(false); // Save incomplete status
            }
          }
          
          // Handle requirements validation for specific exercises
          if (hasRequirements) {
            const validation = createValidationResult(id, code);
            setValidationResult(validation);
            if (validation && validation.valid) {
              setFixed(true);
              markExerciseCompleted(lessonNum, id);
            } else {
              setFixed(false);
            }
          }
        } else {
          // Fallback for other cases
          setCanvasData(result.canvasData);
          setAnimationData(null);
          
          // Handle requirements validation for non-animated cases
          if (hasRequirements) {
            const validation = createValidationResult(id, code);
            setValidationResult(validation);
            if (validation && validation.valid) {
              setFixed(true);
              markExerciseCompleted(lessonNum, id);
            } else {
              setFixed(false);
            }
          } else {
            setValidationResult(null);
          }
        }
        
        if (mustFix && !isLesson5ValidationExercise && !hasRequirements) {
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
        setAnimationData(null);
      } else {
        setOutput(output);
        setHasError(false);
        setCanvasData(null);
        setAnimationData(null);
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
    setFixed(!mustFix && !isLesson5ValidationExercise && !hasRequirements);
    setHasError(false);
    setHasUserEdited(false);
    setCanvasData(null);
    setAnimationData(null);
    setValidationResult(null);
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
          <button 
            onClick={reset} 
            title="Reset" 
            className={`w-6 h-6 ${isNonRunnableTurtleExample ? 'opacity-40 cursor-not-allowed' : ''}`}
            disabled={isNonRunnableTurtleExample}
          >
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
              title={pyodideReady && !isNonRunnableTurtleExample ? "Jalankan kode" : ""}
              className={`w-6 h-6 ${
                !pyodideReady || isNonRunnableTurtleExample ? "opacity-40 cursor-not-allowed" : ""
              }`}
              disabled={!pyodideReady || isNonRunnableTurtleExample}
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
      
      {/* Animated Turtle Canvas */}
      {animationData && (
        <AnimatedTurtleCanvas animationData={animationData} />
      )}

      {/* Validation Feedback */}
      {(isLesson5ValidationExercise || hasRequirements) && validationResult && (
        <div className={`mt-4 p-3 rounded-md border ${validationResult.valid ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">{validationResult.valid ? '✅' : '📋'}</span>
            <span className={`font-medium ${validationResult.valid ? 'text-green-800' : 'text-yellow-800'}`}>
              {validationResult.valid ? 'Sempurna! Semua tugas selesai!' : 'Checklist Tugas:'}
            </span>
          </div>
          
          {!validationResult.valid && (
            <ul className="space-y-1 text-sm">
              {isLesson5ValidationExercise ? (
                // Lesson 5 specific validation
                <>
                  <li className={`flex items-center ${validationResult.checks.forward_100_1 ? 'text-green-700' : 'text-gray-600'}`}>
                    <span className="mr-2">{validationResult.checks.forward_100_1 ? '✅' : '⏳'}</span>
                    Jalan 100 langkah
                  </li>
                  <li className={`flex items-center ${validationResult.checks.right_turn ? 'text-green-700' : 'text-gray-600'}`}>
                    <span className="mr-2">{validationResult.checks.right_turn ? '✅' : '⏳'}</span>
                    Belok kanan
                  </li>
                  <li className={`flex items-center ${validationResult.checks.red_color ? 'text-green-700' : 'text-gray-600'}`}>
                    <span className="mr-2">{validationResult.checks.red_color ? '✅' : '⏳'}</span>
                    Ganti warna jadi merah
                  </li>
                  <li className={`flex items-center ${validationResult.checks.forward_100_2 ? 'text-green-700' : 'text-gray-600'}`}>
                    <span className="mr-2">{validationResult.checks.forward_100_2 ? '✅' : '⏳'}</span>
                    Jalan lagi 100 langkah
                  </li>
                </>
              ) : (
                // Requirements validation for other exercises
                validationResult.requirements.map((req) => (
                  <li key={req.id} className={`flex items-center ${req.passed ? 'text-green-700' : 'text-gray-600'}`}>
                    <span className="mr-2">{req.passed ? '✅' : '⏳'}</span>
                    {req.description}
                  </li>
                ))
              )}
            </ul>
          )}
          
          {validationResult.valid && (
            <p className="text-green-700 text-sm mt-2">
              🎉 Kamu berhasil menyelesaikan semua tugas! Sekarang kamu bisa lanjut ke pelajaran berikutnya.
            </p>
          )}
        </div>
      )}

      {/* Fix prompt */}
      {(mustFix && !fixed) || (isLesson5ValidationExercise && !fixed) || (hasRequirements && !fixed) ? (
        <p className="text-yellow-500 mt-2 text-sm font-medium font-source">
          {(isLesson5ValidationExercise || hasRequirements)
            ? "Selesaikan semua tugas di atas untuk melanjutkan ➤"
            : "Perbaiki kode ini untuk melanjutkan ➤"}
        </p>
      ) : null}
    </div>
  );
};

export default CodeBlock;