// import React, { useState } from "react";
// import "../styles/Faqs.css";

// const Faqs = () => {
//   const faqs = [
//     {
//       question: "Apa itu coding?",
//       answer:
//         "Coding adalah proses menulis, menguji, dan memelihara kode program komputer.",
//     },
//     {
//       question: "Siapa Didi, dan kenapa dia rubber duck?",
//       answer:
//         "Didi adalah rubber duck yang membantu proses debugging dengan menjadi pendengar saat Anda menjelaskan kode Anda.",
//     },
//     {
//       question: "Apakah website ini gratis?",
//       answer: "Ya, website ini sepenuhnya gratis untuk digunakan.",
//     },
//     {
//       question:
//         "Saya tidak mengerti instruksinya, apa yang harus saya lakukan?",
//       answer:
//         "Anda bisa mencoba membaca instruksi kembali dengan lebih perlahan, atau menghubungi tim dukungan kami untuk bantuan lebih lanjut.",
//     },
//     {
//       question:
//         "Bagaimana saya bisa menghubungi tim CowDi jika punya ide atau saran?",
//       answer:
//         "Anda bisa mengirim email ke support@cowdi.com atau menggunakan form kontak di halaman 'Hubungi Kami'.",
//     },
//   ];

//   const [expandedIndex, setExpandedIndex] = useState(null);

//   const toggleFAQ = (index) => {
//     setExpandedIndex(expandedIndex === index ? null : index);
//   };

//   return (
//     <section className="bg-[#FCF4EB] min-h-screen pt-5 px-4 font-[Poppins]">
//       <h1 className="text-[2.5rem] md:text-[3rem] text-[#F98D08] font-[Potta_One] mb-4 text-center">
//         FAQs
//       </h1>
//       <div className="max-w-4xl mx-auto border border-gray-900 divide-y divide-gray-900 bg-white">
//         {faqs.map((faq, index) => (
//           <div key={index}>
//             <button
//               className="flex justify-between items-center w-full p-5 text-left"
//               onClick={() => toggleFAQ(index)}
//             >
//               <span className="text-base md:text-lg text-gray-900 yapping">
//                 {faq.question}
//               </span>
//               <span className="text-xl text-[#F98D08]">
//                 {expandedIndex === index ? "↑" : "↓"}
//               </span>
//             </button>
//             {expandedIndex === index && (
//               <div className="px-5 pb-5 text-gray-700 text-base md:text-base yapping">
//                 {faq.answer}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Faqs;



import React, { useState } from "react";
import "../styles/Faqs.css";

const Faqs = () => {
  const faqs = [
    {
      question: "Apa itu coding?",
      answer: "Coding adalah proses menulis, menguji, dan memelihara kode program komputer.",
    },
    {
      question: "Siapa Didi, dan kenapa dia rubber duck?",
      answer: "Didi adalah rubber duck yang membantu proses debugging dengan menjadi pendengar saat Anda menjelaskan kode Anda.",
    },
    {
      question: "Apakah website ini gratis?",
      answer: "Ya, website ini sepenuhnya gratis untuk digunakan.",
    },
    {
      question: "Saya tidak mengerti instruksinya, apa yang harus saya lakukan?",
      answer: "Anda bisa mencoba membaca instruksi kembali dengan lebih perlahan, atau menghubungi tim dukungan kami untuk bantuan lebih lanjut.",
    },
    {
      question: "Bagaimana saya bisa menghubungi tim CowDi jika punya ide atau saran?",
      answer: "Anda bisa mengirim email ke support@cowdi.com atau menggunakan form kontak di halaman 'Hubungi Kami'.",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="bg-[#FCF4EB] pt-5 pb-16 px-4 font-[Poppins]">
      <h1 className="text-[2.5rem] md:text-[3rem] text-[#F98D08] font-[Potta_One] mb-4 text-center">
        FAQs
      </h1>
      <div className="max-w-4xl mx-auto border border-gray-900 divide-y divide-gray-900 bg-white">
        {faqs.map((faq, index) => (
          <div key={index}>
            <button
              className="flex justify-between items-center w-full p-5 text-left"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-base md:text-lg text-gray-900 yapping">
                {faq.question}
              </span>
              <span className="text-xl text-[#F98D08]">
                {expandedIndex === index ? "↑" : "↓"}
              </span>
            </button>
            {expandedIndex === index && (
              <div className="px-5 pb-5 text-gray-700 text-base md:text-base yapping">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faqs;
