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
import { setLesson5ValidationStatus, markExerciseCompleted, markMustFixCompleted, getLessonProgress, setLessonProgress } from "../utils/lessonProgress";
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

const CodeBlock = ({ snippet, lessonNum, optionalMessage }) => {
  const { id, starterCode, mustFix } = snippet;
  const storageKey = `lesson${lessonNum}-${id}-${starterCode}`;
  
  // Check if this is the lesson 5 validation exercise
  const isLesson5ValidationExercise = id === "python-hello-correct-5-6";
  
  // Check if this is the first turtle example that shouldn't be runnable (only python-correct-5-1)
  const isNonRunnableTurtleExample = id === "python-correct-5-1";
  
  // Check if this exercise has specific requirements (like lesson 5)
  const hasRequirements = ['python-correct-7-4', 'python-correct-6-5', 'python-correct-6-4'].includes(id);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [hasError, setHasError] = useState(false);
  const [fixed, setFixed] = useState(() => {
    try {
      console.log(`[${id}] Initializing fixed state - mustFix: ${mustFix}, hasRequirements: ${hasRequirements}, isLesson5: ${isLesson5ValidationExercise}`);
      
      if (mustFix && lessonNum) {
        // Check if this mustFix exercise was already completed
        const progress = getLessonProgress(lessonNum);
        const result = progress.mustFixCompleted?.[id] === true || progress[id] === true;
        console.log(`[${id}] mustFix check: result = ${result}`);
        return result;
      }
      if (isLesson5ValidationExercise && lessonNum) {
        const progress = getLessonProgress(lessonNum);
        const result = progress.validationCompleted === true;
        console.log(`[${id}] lesson5 validation check: result = ${result}`);
        return result;
      }
      if (hasRequirements && lessonNum) {
        const progress = getLessonProgress(lessonNum);
        const isCompleted = progress[id] === true;
        console.log(`[${id}] hasRequirements check: progress[${id}] = ${progress[id]}, isCompleted = ${isCompleted}`, progress);
        return isCompleted;
      }
      const defaultResult = !mustFix && !isLesson5ValidationExercise && !hasRequirements;
      console.log(`[${id}] default fallback: result = ${defaultResult}`);
      return defaultResult;
    } catch (error) {
      console.error('Error initializing fixed state:', error);
      const errorResult = !mustFix && !isLesson5ValidationExercise && !hasRequirements;
      console.log(`[${id}] error fallback: result = ${errorResult}`);
      return errorResult;
    }
  });
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [canvasData, setCanvasData] = useState(null);
  const [animationData, setAnimationData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const textareaRef = useRef(null);
  const executionCancelRef = useRef(null);
  const runTimeoutRef = useRef(null);
  const lastRunTimeRef = useRef(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCode(saved);
        setHasUserEdited(true);
      } else {
        setCode(starterCode.endsWith("\n") ? starterCode : starterCode + "\n");
      }
    } catch (error) {
      console.warn('localStorage not available, using default code');
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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (executionCancelRef.current) {
        executionCancelRef.current();
      }
      if (runTimeoutRef.current) {
        clearTimeout(runTimeoutRef.current);
      }
    };
  }, []);

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

  const executeCode = async () => {
    if (!pyodideReady) {
      setOutput("⏳ Python belum siap! Tunggu sebentar ya...");
      return;
    }

    setIsExecuting(true);
    
    // Create cancel token for this execution
    let isCancelled = false;
    executionCancelRef.current = () => {
      isCancelled = true;
      setIsExecuting(false);
    };

    const isTurtleCode = code.includes('turtle') || code.includes('from turtle');
    
    if (isTurtleCode) {
      try {
        const result = await runTurtle(code);
        
        // Check if execution was cancelled
        if (isCancelled) {
          return;
        }
        
        try {
          localStorage.setItem(storageKey, code);
        } catch (e) {
          console.warn('Failed to save code to localStorage');
        }

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
              if (lessonNum && id) {
                markMustFixCompleted(lessonNum, id);
              }
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
              if (mustFix && lessonNum && id) {
                markMustFixCompleted(lessonNum, id);
              }
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
              if (mustFix && lessonNum && id) {
                markMustFixCompleted(lessonNum, id);
              }
            } else {
              setFixed(false);
            }
          } else {
            setValidationResult(null);
          }
        }
        
        if (mustFix && !isLesson5ValidationExercise && !hasRequirements) {
          setFixed(true);
          if (lessonNum && id) {
            markMustFixCompleted(lessonNum, id);
          }
        }
        }
      } catch (error) {
        if (!isCancelled) {
          setOutput("Error executing code: " + error.message);
          setHasError(true);
          setFixed(false);
          setCanvasData(null);
          setAnimationData(null);
        }
      }
    } else {
      try {
        const { output, error } = await runPython(code);
        
        // Check if execution was cancelled
        if (isCancelled) {
          return;
        }
        
        try {
          localStorage.setItem(storageKey, code);
        } catch (e) {
          console.warn('Failed to save code to localStorage');
        }

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
            if (lessonNum && id) {
              markMustFixCompleted(lessonNum, id);
            }
          }
        }
      } catch (error) {
        if (!isCancelled) {
          setOutput("Error executing code: " + error.message);
          setHasError(true);
          setFixed(false);
        }
      }
    }
    
    // Clean up execution state
    if (!isCancelled) {
      setIsExecuting(false);
      executionCancelRef.current = null;
    }
  };

  const run = () => {
    const now = Date.now();
    
    // Aggressive throttling - ignore clicks within 200ms
    if (now - lastRunTimeRef.current < 200) {
      return;
    }
    
    lastRunTimeRef.current = now;

    // Clear any existing timeout
    if (runTimeoutRef.current) {
      clearTimeout(runTimeoutRef.current);
    }

    // Cancel any existing execution immediately
    if (executionCancelRef.current) {
      executionCancelRef.current();
    }

    // Clear animation data immediately to stop any running animations
    setAnimationData(null);
    setCanvasData(null);
    setOutput("");
    
    // Set executing state immediately to prevent multiple clicks
    setIsExecuting(true);

    // Execute immediately without debounce
    executeCode();
  };

  const reset = () => {
    // Cancel any running execution
    if (executionCancelRef.current) {
      executionCancelRef.current();
    }
    if (runTimeoutRef.current) {
      clearTimeout(runTimeoutRef.current);
      runTimeoutRef.current = null;
    }
    
    const initial = starterCode.endsWith("\n")
      ? starterCode
      : starterCode + "\n";
    setCode(initial);
    setOutput("");
    setFixed(!mustFix && !isLesson5ValidationExercise && !hasRequirements);
    setHasError(false);
    setHasUserEdited(false);
    setIsExecuting(false);
    setCanvasData(null);
    setAnimationData(null);
    setValidationResult(null);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn('Failed to remove code from localStorage');
    }
    
    // Also reset completion status when resetting
    if ((mustFix || hasRequirements) && lessonNum) {
      try {
        const currentProgress = getLessonProgress(lessonNum);
        if (currentProgress.mustFixCompleted?.[id] || currentProgress[id]) {
          const { mustFixCompleted, ...otherProgress } = currentProgress;
          const newMustFixCompleted = mustFixCompleted ? { ...mustFixCompleted } : {};
          delete newMustFixCompleted[id];
          delete otherProgress[id];
          
          setLessonProgress(lessonNum, {
            ...otherProgress,
            mustFixCompleted: newMustFixCompleted
          });
        }
      } catch (error) {
        console.error('Error resetting mustFix completion:', error);
      }
    }
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
              title={
                !pyodideReady || isNonRunnableTurtleExample 
                  ? "" 
                  : isExecuting 
                    ? "Jalankan ulang kode (akan membatalkan eksekusi sebelumnya)"
                    : "Jalankan kode"
              }
              className={`w-6 h-6 ${
                !pyodideReady || isNonRunnableTurtleExample ? "opacity-40 cursor-not-allowed" : 
                isExecuting ? "opacity-70" : ""
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const textarea = e.target;
              const cursorPosition = textarea.selectionStart;
              const textBeforeCursor = textarea.value.substring(0, cursorPosition);
              const textAfterCursor = textarea.value.substring(cursorPosition);
              const currentLineMatch = textBeforeCursor.match(/([^\n]*)$/);
              const currentLine = currentLineMatch ? currentLineMatch[1] : '';
              
              // Check if current line ends with 'for' statement and colon
              const forLoopPattern = /^\s*for\s+.+:\s*$/;
              if (forLoopPattern.test(currentLine.trim())) {
                e.preventDefault();
                const indentMatch = currentLine.match(/^(\s*)/);
                const currentIndent = indentMatch ? indentMatch[1] : '';
                const newIndent = currentIndent + '  '; // Add 2 spaces for indentation
                
                const newValue = textBeforeCursor + '\n' + newIndent + textAfterCursor;
                const newCursorPosition = cursorPosition + 1 + newIndent.length;
                
                setCode(newValue);
                setHasUserEdited(true);
                
                // Set cursor position after state update
                setTimeout(() => {
                  textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
                }, 0);
                return;
              }
              
              // Handle indentation logic
              const lines = textBeforeCursor.split('\n');
              const currentLineEmpty = currentLine.trim() === '';
              const currentLineIndent = currentLine.match(/^(\s*)/);
              const currentIndentLevel = currentLineIndent ? currentLineIndent[1] : '';
              
              // If current line is empty and indented, double enter should dedent
              if (currentLineEmpty && currentIndentLevel.length > 0) {
                e.preventDefault();
                // Remove indentation for empty line
                const newValue = textBeforeCursor + '\n' + textAfterCursor;
                const newCursorPosition = cursorPosition + 1;
                
                setCode(newValue);
                setHasUserEdited(true);
                
                setTimeout(() => {
                  textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
                }, 0);
                return;
              }
              
              // If current line has content (non-empty), maintain its indentation for next line
              if (!currentLineEmpty && currentIndentLevel.length > 0) {
                e.preventDefault();
                const newValue = textBeforeCursor + '\n' + currentIndentLevel + textAfterCursor;
                const newCursorPosition = cursorPosition + 1 + currentIndentLevel.length;
                
                setCode(newValue);
                setHasUserEdited(true);
                
                setTimeout(() => {
                  textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
                }, 0);
                return;
              }
            }
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
        <AnimatedTurtleCanvas 
          animationData={animationData} 
          exerciseId={id} 
          isExecuting={isExecuting}
          onAnimationComplete={() => {
            setIsExecuting(false);
            executionCancelRef.current = null;
          }}
        />
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
          {optionalMessage ? optionalMessage : 
            (isLesson5ValidationExercise || hasRequirements)
              ? "Selesaikan semua tugas di atas untuk melanjutkan ➤"
              : "Perbaiki kode ini untuk melanjutkan ➤"}
        </p>
      ) : null}
    </div>
  );
};

export default CodeBlock;