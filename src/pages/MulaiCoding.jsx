import { useParams } from "react-router-dom";
import CodingNavbar from "../components/CodingNavbar";
import LessonRenderer from "../components/LessonRenderer";

const MulaiCoding = () => {
  const { lessonNumber } = useParams();
  const lessonNum = parseInt(lessonNumber || "1", 10);

  return (
    <>
      <CodingNavbar />
      <div className="min-h-screen bg-[#FCF4EB] p-6">
        <LessonRenderer lessonNum={lessonNum} />
      </div>
    </>
  );
};

export default MulaiCoding;
