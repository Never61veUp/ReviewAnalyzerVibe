import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { uploadFile } from "../api/client";
import { FileUploadResponse } from "../api/api";

interface Props {
  file: File | null;
  onComplete?: (percentage: number) => void;
}

export default function NeonRingProgress({ file, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const radius = 55;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!file) return;

    const analyzeFile = async () => {
      setIsAnalyzing(true);
      setProgress(0);
      setPercentage(null);

      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90));
      }, 100);

      try {
        // Отправляем файл на сервер
        const result: FileUploadResponse | {} = await uploadFile(file);

        clearInterval(interval);
        setProgress(100);

        // Проверяем, что сервер вернул корректный объект
        if (!("id" in result)) throw new Error("Неверный ответ сервера");

        // Берем процент положительных отзывов
        // Предположим, сервер возвращает поле `generalScore` или `percentagePositiveReview` в объекте
        // Если API не отдаёт напрямую, нужно будет fetchGroupReviews(result.id)
        const percent = (result as any).percentagePositiveReview ?? 0;

        setPercentage(percent);
        onComplete?.(percent);
      } catch (err: any) {
        console.error(err);
        clearInterval(interval);
        setProgress(0);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeFile();
  }, [file, onComplete]);

  const offset = circumference - (progress / 100) * circumference;

  const getColor = () => {
    const value = percentage !== null ? percentage : progress;
    if (value < 40) return "#e74c3c";
    if (value < 70) return "#f1c40f";
    return "#27ae60";
  };

  return (
    <div className="w-full h-full p-4 flex items-center justify-center">
      <div
        className="
          w-full h-full
          flex flex-col items-center justify-center
          rounded-2xl p-4
          bg-[var(--card)]
          border border-[var(--border)]
          shadow-[0_0_15px_var(--primary)/10]
        "
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            className="absolute w-[150px] h-[150px] rounded-full"
            animate={{
              boxShadow: [
                "0 0 8px var(--primary)",
                "0 0 14px var(--primary)",
                "0 0 8px var(--primary)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ border: "3px solid var(--primary)" }}
          />

          <svg width="160" height="160" className="rotate-[-90deg]">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="var(--border)"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={getColor()}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.2s linear" }}
            />
          </svg>

          <div className="absolute text-center">
            <p className="text-[var(--text)] text-2xl font-bold">
              {percentage !== null ? `${percentage}%` : `${progress}%`}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-[var(--text)]/70 font-medium">
          {percentage !== null
            ? "Результат анализа"
            : "Текущий прогресс анализа"}
        </p>
      </div>
    </div>
  );
}
