import React, { useState } from "react";
import "../styles/Faqs.css";

const Faqs = () => {
  const faqs = [
    {
      question: "Apa itu coding?",
      answer:
        "Coding adalah proses memberi instruksi pada komputer menggunakan bahasa yang ia mengerti. Dengan coding, kita bisa membuat game, aplikasi, situs web, hingga teknologi yang membantu kehidupan sehari-hari. Bersama Cowdi, kamu bisa memulainya dari nol dengan cara yang seru dan mudah dipahami.",
    },
    {
      question: "Siapa Didi, dan kenapa dia rubber duck?",
      answer:
        "Didi adalah maskot kita berbentuk bebek karet lucu, terinspirasi dari teknik 'rubber duck debugging', metode di mana kita menjelaskan kode langkah demi langkah seolah kepada bebek karet, agar pikiran jadi lebih jernih. Di sini, Didi menemani perjalanan belajarmu dengan tips dan tantangan seru, membuat proses coding jadi lebih menyenangkan.",
    },
    {
      question: "Apakah website ini gratis?",
      answer:
        "Iya, semua materi di sini 100% gratis. Kami percaya bahwa ilmu harus bisa dijangkau oleh semua anak bangsa. Misi kami adalah membantu siapa pun yang ingin belajar coding agar punya bekal keterampilan untuk masa depan dan membangkitkan minat belajar anak-anak bangsa, tanpa terhalang status ekonomi.",
    },
    {
      question:
        "Saya tidak mengerti instruksinya, apa yang harus saya lakukan?",
      answer:
        "Tenang. Ulangi instruksinya langkah demi langkah dan perhatikan contoh kodenya. Kalau masih bingung, itu wajar saat belajar. Kamu bisa kirim email ke codingwithdidi@gmail.com atau DM IG melalui @codingwithdidi, dan kami akan membantu sampai kamu paham.",
    },
    {
      question:
        "Bagaimana saya bisa menghubungi tim CowDi jika punya ide atau saran?",
      answer:
        "Kami selalu terbuka terhadap ide dan saran. Anda bisa menghubungi kami lewat email codingwithdidi@gmail.com atau DM melalui IG @codingwithdidi. Siapa tahu dari ide kamu, lahir cara belajar coding yang lebih seru dan bermanfaat buat banyak orang di Indonesia!",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="bg-[#FCF4EB] pt-5 px-4 font-[Poppins] pb-8">
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
