import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeroSection from "../../components/HeroSection";
import ModeToggle from "../../components/ModeToggle";
import SingleAnalysis from "../../components/SingleAnalysis";
import BatchAnalysis from "../../components/BatchAnalysis";
import { FaSmile, FaClock, FaCheckCircle } from "react-icons/fa";

export default function Home() {
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();

  // --- Мок функции анализа текста ---
  const handleTextAnalyze = () => {
    if (!textInput.trim()) return;

    // Мокаем результат
    const charsCount = textInput.length;
    const wordsCount = textInput.trim().split(/\s+/).length;
    const percentagePositiveReview = Math.min(100, 50 + (charsCount % 50));

    const groupResponse = {
      result: {
        groups: [
          {
            id: crypto.randomUUID(),
            name: "Одиночный анализ",
            date: new Date().toISOString(),
            generalScore: percentagePositiveReview / 100,
            reviews: [
              { id: "1", text: `Текст длиной ${charsCount} символов`, label: "positive", confidence: percentagePositiveReview / 100 },
              { id: "2", text: `Количество слов: ${wordsCount}`, label: "neutral", confidence: 0.6 },
              { id: "3", text: "Пример негативного отзыва", label: "negative", confidence: 0.4 },
            ],
          },
        ],
        percentagePositiveReview,
      },
      errorMessage: null,
      timeGenerated: new Date().toISOString(),
    };

    navigate("/analysis-result", { state: { data: groupResponse } });
  };

  // --- Данные карточек ---
  const stats = [
    { label: "Проанализировано отзывов", value: 24567, extra: "+12% за месяц", icon: <FaCheckCircle size={24} /> },
    { label: "Точность модели", value: 94.3, extra: "На тестовой выборке", icon: <FaCheckCircle size={24} /> },
    { label: "Среднее время анализа", value: 0.8, extra: "Для одного текста", icon: <FaClock size={24} /> },
    { label: "Позитивных отзывов", value: 68, extra: "От всех обращений", icon: <FaSmile size={24} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
      <HeroSection />
      <ModeToggle mode={mode} setMode={setMode} />

      <section className="flex flex-col lg:flex-row justify-center items-start gap-6 px-6 lg:px-16 mt-8">
        {mode === "single" ? (
          <SingleAnalysis
            textInput={textInput}
            setTextInput={setTextInput}
            onAnalyze={handleTextAnalyze}
          />
        ) : (
          <BatchAnalysis file={file} setFile={setFile} />
        )}
      </section>

      <section className="mt-12 px-6 lg:px-16 mb-32">
        <h2 className="text-2xl font-bold mb-8 text-center">Ключевые показатели анализа</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-3xl border border-white/20 backdrop-blur-md bg-white/10 shadow-xl flex flex-col items-center text-center relative overflow-hidden hover:shadow-2xl transition-transform"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="mb-3 text-[var(--text)]">{stat.icon}</div>

              <motion.p
                className="text-4xl font-extrabold mb-2 text-[var(--text)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: idx * 0.2 }}
              >
                {stat.value.toLocaleString()}
              </motion.p>

              <p className="text-sm text-[var(--text)]/70 mb-1">{stat.label}</p>
              <p className="text-[var(--text)]/60 text-sm">{stat.extra}</p>

              {stat.value <= 100 && (
                <div className="w-full h-2 rounded-full bg-[var(--line-bg)] mt-4 overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full bg-[var(--primary)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
