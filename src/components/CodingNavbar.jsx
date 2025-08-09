import React, { useState, useEffect } from "react";
import { assets } from "./../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import {
  canAccessLesson,
  isLessonRequirementsCompleted,
  getIncompleteMustFixExercises,
} from "../utils/lessonProgress";

const CodingNavbar = () => {
  const navigate = useNavigate();
  const { lessonNum } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Chapter data with titles and short descriptions
  const chapters = [
    {
      num: 1,
      title: "Apa Itu Coding dan Python?",
      shortTitle: "Pengenalan Coding",
      description: "Dasar-dasar programming",
    },
    {
      num: 2,
      title: "🧠 Komputer Bisa Ingat? Yuk Kenalan Sama Variabel!",
      shortTitle: "Variabel",
      description: "Menyimpan data dalam program",
    },
    {
      num: 3,
      title: "Ini Angka atau Kata, Ya?",
      shortTitle: "Tipe Data",
      description: "Angka, teks, dan operasi",
    },
    {
      num: 4,
      title: "Ulang-Ulang? Tinggal For! + Jurus Rahasia Python 🪄",
      shortTitle: "Loop & Function",
      description: "Pengulangan dan fungsi",
    },
    {
      num: 5,
      title: "PyTurtle Dasar, Si Kura-Kura Ajaib",
      shortTitle: "PyTurtle Dasar",
      description: "Menggambar dengan kode",
    },
    {
      num: 6,
      title: "Belok Sana, Belok Sini! Yuk Belajar Derajat!",
      shortTitle: "Sudut & Bentuk",
      description: "Sudut dan geometri",
    },
    {
      num: 7,
      title: "✨ Bentuk Ajaib dan Pola Warna-Warni!",
      shortTitle: "Bentuk Lanjutan",
      description: "Pola dan warna kompleks",
    },
  ];

  // Utility function to truncate long titles
  const truncateTitle = (title, maxLength = 50) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength).trim() + "...";
  };

  // Handle chapter navigation
  const handleChapterClick = (chapterNum) => {
    if (canAccessLesson(chapterNum)) {
      navigate(`/mulaicoding/${chapterNum}`);
      setIsSidebarOpen(false);
    } else {
      // Find which lesson is blocking access
      const blockingLesson = chapterNum - 1;
      const incompleteExercises = getIncompleteMustFixExercises(blockingLesson);

      if (incompleteExercises.length > 0) {
        alert(
          `Selesaikan semua latihan wajib di Bab ${blockingLesson} terlebih dahulu!\n\nLatihan yang belum diselesaikan: ${incompleteExercises.length} latihan`
        );
      } else {
        alert(
          `Selesaikan semua tugas di Bab ${blockingLesson} terlebih dahulu!`
        );
      }
    }
  };

  // Check if a chapter is accessible
  const isChapterAccessible = (chapterNum) => {
    return canAccessLesson(chapterNum);
  };

  // Check if a chapter is completed
  const isChapterCompleted = (chapterNum) => {
    return isLessonRequirementsCompleted(chapterNum);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        !event.target.closest(".sidebar-container") &&
        !event.target.closest(".hamburger-btn")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <nav className="bg-[#FCF4EB] sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      {/* Logo on the left */}
      <button onClick={() => navigate("/")} className="flex items-center">
        <img
          src={assets.crop_logo}
          className="logo cursor-pointer"
          alt="logo"
        />
      </button>

      {/* Hamburger Icon on the right */}
      <button
        className="hamburger-btn p-2"
        style={{ color: "#F98D08" }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-30 backdrop-blur-sm z-40" />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-container fixed top-0 right-0 h-full w-80 bg-[#FCF4EB] bg-opacity-95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Fixed Header */}
        <div className="p-6 border-b border-[#E8DCC6] border-opacity-50 bg-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#3D83AC] mb-1">
                Daftar Bab
              </h2>
              <p className="text-sm text-[#66BAEF]">
                Pilih bab untuk melanjutkan
              </p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-[#3D83AC] hover:text-[#F98D08] hover:bg-[#E8DCC6] rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Chapter List */}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#91CADB #E8DCC6",
          }}
        >
          <div className="space-y-4">
            {chapters.map((chapter) => {
              const isAccessible = isChapterAccessible(chapter.num);
              const isCompleted = isChapterCompleted(chapter.num);
              const isCurrent = parseInt(lessonNum) === chapter.num;

              return (
                <button
                  key={chapter.num}
                  onClick={() => handleChapterClick(chapter.num)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] ${
                    isCurrent
                      ? "bg-[#91CADB] border-[#91CADB] text-white shadow-lg"
                      : isAccessible
                      ? "bg-white border-[#E8DCC6] hover:border-[#91CADB] hover:bg-[#E8F4FD] hover:shadow-md"
                      : "bg-[#F5F5F5] border-[#E0E0E0] cursor-not-allowed opacity-60"
                  }`}
                  disabled={!isAccessible}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded-full ${
                            isCurrent
                              ? "bg-white bg-opacity-20 text-white"
                              : isAccessible
                              ? "bg-[#F98D08] text-white"
                              : "bg-gray-300 text-gray-500"
                          }`}
                        >
                          Bab {chapter.num}
                        </span>
                        {isCompleted && (
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-green-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs text-green-500 font-medium">
                              Selesai
                            </span>
                          </div>
                        )}
                      </div>
                      <h3
                        className={`font-semibold text-base leading-tight mb-2 ${
                          isCurrent
                            ? "text-white"
                            : isAccessible
                            ? "text-[#3D83AC]"
                            : "text-gray-500"
                        }`}
                        title={chapter.title}
                      >
                        {truncateTitle(chapter.title, 45)}
                      </h3>
                      <p
                        className={`text-xs leading-relaxed ${
                          isCurrent
                            ? "text-white opacity-90"
                            : isAccessible
                            ? "text-[#66BAEF]"
                            : "text-gray-400"
                        }`}
                      >
                        {chapter.description}
                      </p>
                    </div>
                    {!isAccessible && (
                      <div className="ml-2 mt-1">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CodingNavbar;
