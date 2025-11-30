import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  groupId: string;
  onComplete?: (percentage: number) => void;
}

interface ApiResponse {
  result: number; // процент позитивных отзывов
  errorMessage: string | null;
  timeGenerated: string;
}

export default function NeonProgress({ groupId, onComplete }: Props) {
  const [percentage, setPercentage] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const radius = 70;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!groupId) return;

    const fetchPercentage = async () => {
      setLoading(true);
      setProgress(0);

      // имитация прогресса
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90));
      }, 50);

      try {
        const res = await fetch(
          `https://api.reviewanalyzer.mixdev.me/Review/review-percent-positive?groupId=${groupId}`
        );

        if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);

        const data: ApiResponse = await res.json();
        clearInterval(interval);

        setPercentage(data.result ?? 0);
        setProgress(100);

        onComplete?.(data.result ?? 0);
      } catch (err: any) {
        console.error(err);
        clearInterval(interval);
        setProgress(0);
        setPercentage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPercentage();
  }, [groupId, onComplete]);

  const offset = circumference - ((progress / 100) * circumference);

  const getColor = () => {
    if (percentage === null) return "#4ade80";
    if (percentage < 40) return "#f87171"; // красный
    if (percentage < 70) return "#facc15"; // желтый
    return "#4ade80"; // зеленый
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-[180px] h-[180px]">
        {/* Неоновый мерцающий эффект */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-full"
          animate={{
            boxShadow: [
              `0 0 10px ${getColor()}`,
              `0 0 20px ${getColor()}`,
              `0 0 10px ${getColor()}`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ border: `4px solid ${getColor()}` }}
        />

        <svg width="180" height="180" className="rotate-[-90deg]">
          {/* Фон круга */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="var(--border)"
            strokeWidth={stroke}
            fill="none"
          />
          {/* Прогресс */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke={getColor()}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
        </svg>

        {/* Текст внутри круга */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-[var(--text)]">
            {percentage !== null ? `${percentage.toFixed(1)}%` : `${progress}%`}
          </p>
          <p className="text-sm text-[var(--text)]/70 mt-1">Позитивные отзывы</p>
        </div>
      </div>

      {/* Сообщение при загрузке */}
      {loading && <p className="text-center mt-2 text-[var(--text)]/70">Загрузка...</p>}
      {!loading && percentage === null && (
        <p className="text-center mt-2 text-red-500">Нет данных по этой группе</p>
      )}
    </div>
  );
}
