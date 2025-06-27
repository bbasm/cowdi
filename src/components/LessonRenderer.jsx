import React, { useEffect, useState } from "react";
import BlockRenderer from "./BlockRenderer";

const LessonRenderer = () => {
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/data/lesson1.json")
      .then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then(setLesson)
      .catch(err => {
        console.error(err);
        setError(true);
      });
  }, []);

  if (error) return <p className="text-red-500 text-center">Gagal memuat pelajaran 😢</p>;
  if (!lesson) return <p className="text-center">Loading...</p>;

  return (
    // <div className="max-w-3xl mx-auto space-y-12">
    <div className="min-h-screen bg-[#FCF4EB] pr-50 pl-50">
      <h1 className="text-[2rem] md:text-[3rem] text-center text-[#F98D08] font-bold mb-5">{lesson.title}</h1>
      {/* <h1 className="text-3xl font-bold text-center text-[#F98D08]">{lesson.title}</h1> */}
      {lesson.blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );
};

export default LessonRenderer;
