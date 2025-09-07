import React, { useEffect, useState } from "react";
import BlockRenderer from "./BlockRenderer";
import { useNavigate } from "react-router-dom";
import { canAccessLesson, isLesson5ValidationCompleted, isLessonRequirementsCompleted, getIncompleteMustFixExercises } from "../utils/lessonProgress";

const LessonRenderer = ({ lessonNum }) => {
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(false);
  const [canProceed, setCanProceed] = useState(true);
  const navigate = useNavigate();

  const nextLesson = `/mulaicoding/${lessonNum + 1}`;
  const prevLesson = `/mulaicoding/${lessonNum - 1}`;
  
  // Check if user can proceed to next lesson
  const checkCanProceed = () => {
    // All lessons now require mustFix completion plus any additional requirements
    return isLessonRequirementsCompleted(lessonNum);
  };
  
  // Check if this is the final lesson
  const isFinalLesson = lessonNum === 7;
  
  const handleNextLesson = () => {
    if (isFinalLesson) {
      // Show completion message for final lesson
      alert(`🎉 Selamat! Kamu telah menyelesaikan semua pelajaran CowDi!\n\nKamu sudah menjadi programmer PyTurtle yang handal! Teruslah bereksperimen dan berkreasi dengan kode-mu! 🐢✨`);
      return;
    }
    
    if (canProceed) {
      // Scroll to top immediately before navigation
      window.scrollTo({ top: 0, behavior: 'instant' });
      navigate(nextLesson);
    } else {
      // Show warning with specific incomplete exercises
      const incompleteMustFix = getIncompleteMustFixExercises(lessonNum);
      if (incompleteMustFix.length > 0) {
        alert(`Selesaikan semua latihan wajib di pelajaran ini terlebih dahulu!\n\nLatihan yang belum diselesaikan: ${incompleteMustFix.length} latihan`);
      } else {
        alert("Selesaikan semua tugas di pelajaran ini sebelum melanjutkan!");
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });

    fetch(`/data/lesson${lessonNum}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        setLesson(data);
        setError(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, [lessonNum]);

  // Update canProceed state when lesson changes or when localStorage changes
  useEffect(() => {
    setCanProceed(checkCanProceed());
  }, [lessonNum]);

  // Listen for storage changes to update progress in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      setCanProceed(checkCanProceed());
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when localStorage is updated from same tab
    window.addEventListener('lessonProgressUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('lessonProgressUpdated', handleStorageChange);
    };
  }, [lessonNum]);

  if (error)
    return (
      <p className="text-red-500 text-center">Gagal memuat pelajaran 😢</p>
    );
  if (!lesson) return (
    <div className="min-h-screen bg-[#FCF4EB] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F98D08] mx-auto mb-4"></div>
        <p className="text-[#F98D08] font-semibold">Memuat pelajaran...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCF4EB] px-4 sm:px-8 md:px-16 lg:px-[100px] xl:px-[120px]">
      <h1 className="text-[2rem] md:text-[3rem] text-center text-[#F98D08] font-bold mb-5">
        {lesson.title}
      </h1>

      {lesson.blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} lessonNum={lessonNum} />
      ))}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">
        {lessonNum > 1 ? (
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'instant' });
              navigate(prevLesson);
            }}
            className="flex items-center justify-center gap-2 sm:gap-3 bg-[#91CADB] text-white font-bold rounded-lg shadow-md px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Modul ke-{lessonNum - 1}</span>
          </button>
        ) : (
          <div className="w-full sm:w-auto" />
        )}

        <button
          onClick={handleNextLesson}
          className={`flex items-center justify-center gap-2 sm:gap-3 font-bold rounded-lg shadow-md px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto ${
            canProceed 
              ? (isFinalLesson ? 'bg-[#F98D08] text-white hover:bg-[#E8790A]' : 'bg-[#91CADB] text-white hover:bg-[#7FB8CD]')
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
          disabled={!canProceed}
        >
          <span>
            {!canProceed 
              ? `Selesaikan tugas dulu`
              : isFinalLesson 
                ? `🎉 Selesai!`
                : `Lanjut Modul ke-${lessonNum + 1}`}
          </span>
          {canProceed && !isFinalLesson && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {canProceed && isFinalLesson && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {!canProceed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.667-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default LessonRenderer;
