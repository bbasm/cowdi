import React, { useEffect, useState } from "react";
import BlockRenderer from "./BlockRenderer";
import { useNavigate } from "react-router-dom";

const LessonRenderer = ({ lessonNum }) => {
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const nextLesson = `/mulaicoding/${lessonNum + 1}`;
  const prevLesson = `/mulaicoding/${lessonNum - 1}`;

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

  if (error)
    return (
      <p className="text-red-500 text-center">Gagal memuat pelajaran 😢</p>
    );
  if (!lesson) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#FCF4EB] px-4 sm:px-8 md:px-16 lg:px-[100px] xl:px-[120px]">
      <h1 className="text-[2rem] md:text-[3rem] text-center text-[#F98D08] font-bold mb-5">
        {lesson.title}
      </h1>

      {lesson.blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">
        {lessonNum > 1 ? (
          <button
            onClick={() => navigate(prevLesson)}
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
          onClick={() => navigate(nextLesson)}
          className="flex items-center justify-center gap-2 sm:gap-3 bg-[#91CADB] text-white font-bold rounded-lg shadow-md px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
        >
          <span>Lanjut Modul ke-{lessonNum + 1}</span>
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
        </button>
      </div>
    </div>
  );
};

export default LessonRenderer;
