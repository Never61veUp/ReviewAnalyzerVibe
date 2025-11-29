import React, { useState, useEffect } from "react";
import { FaSmile, FaFrown, FaMeh } from "react-icons/fa";
import { motion } from "framer-motion";
import { uploadFile } from "../api/client";
import { FileUploadResponse } from "../api/api";

interface Props {
  file: File | null;
}

export default function SatisfactionLine({ file }: Props) {
  const [satisfaction, setSatisfaction] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!file) return;

    const analyzeFile = async () => {
      setIsAnalyzing(true);
      setSatisfaction(0);

      const interval = setInterval(() => {
        setSatisfaction((prev) => Math.min(prev + 3, 90));
      }, 100);

      try {
        // Отправка файла на сервер
        const result: FileUploadResponse | {} = await uploadFile(file);
        clearInterval(interval);

        if (!("id" in result)) throw new Error("Неверный ответ сервера");

        // Берем процент положительных отзывов с сервера
        // Если сервер не возвращает напрямую, можно потом сделать fetchGroupReviews(result.id)
        const percent = (result as any).percentagePositiveReview ?? 0;

        setSatisfaction(percent);
      } catch (err) {
        console.error(err);
        clearInterval(interval);
        setSatisfaction(0);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeFile();
  }, [file]);

  const sentiment =
    satisfaction > 60
      ? "Позитивный"
      : satisfaction < 40
      ? "Негативный"
      : "Нейтральный";

  const gradient =
    sentiment === "Позитивный"
      ? "linear-gradient(90deg, #33cc6a, #27ae60)"
      : sentiment === "Негативный"
      ? "linear-gradient(90deg, #e74c3c, #ff4d4d)"
      : "linear-gradient(90deg, #f1c40f, #ffc233)";

  const smileAnimation =
    sentiment === "Позитивный"
      ? { scale: [1, 1.1, 1], y: [0, -6, 0] }
      : sentiment === "Негативный"
      ? { scale: [1, 1.05, 1], y: [0, -3, 0] }
      : { scale: [1, 1.05, 1], y: [0, -2, 0] };

  const smileColor = `var(--smile)`;

  return (
    <div className="w-full h-full p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-3 tracking-wide" style={{ color: "var(--primary)" }}>
        Удовлетворенность граждан
      </h3>

      <div className="relative w-full h-10 rounded-full backdrop-blur-xl border border-white/20 overflow-hidden bg-[var(--line-bg)]">
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{
            background: gradient,
            backgroundSize: "200% 100%",
            filter: "blur(4px)",
            opacity: 0.7,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            mask: `linear-gradient(90deg, white ${satisfaction}%, transparent ${satisfaction}%)`,
            WebkitMask: `linear-gradient(90deg, white ${satisfaction}%, transparent ${satisfaction}%)`,
          }}
        />

        {/* Смайлик */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ left: `${satisfaction}%`, top: "6px", transform: "translateX(-50%)" }}
          animate={smileAnimation}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {sentiment === "Позитивный" && <FaSmile size={32} color={smileColor} />}
          {sentiment === "Нейтральный" && <FaMeh size={32} color={smileColor} />}
          {sentiment === "Негативный" && <FaFrown size={32} color={smileColor} />}
        </motion.div>
      </div>

      {/* Цифры */}
      <div className="w-full flex justify-between px-1 mt-2 text-[10px] text-[var(--text)]/60 select-none">
        {[0, 20, 40, 60, 80, 100].map((val) => (
          <span key={val}>{val}%</span>
        ))}
      </div>

      {/* Текущее значение */}
      <p className="mt-3 font-medium text-[var(--text)] text-sm">
        {isAnalyzing ? "Анализируется..." : `Текущее значение: ${satisfaction}%`}
      </p>
    </div>
  );
}
