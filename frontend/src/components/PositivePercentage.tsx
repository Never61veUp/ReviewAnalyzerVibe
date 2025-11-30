import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  groupId: string;
  onComplete?: (percentage: number) => void;
}

interface ApiResponse {
  result: number;
  errorMessage: string | null;
  timeGenerated: string;
}

export default function PositivePercentage({ groupId, onComplete }: Props) {
  const [percentage, setPercentage] = useState<number | null>(null);
  const [displayed, setDisplayed] = useState(0);
  const [loading, setLoading] = useState(true);

  const radius = 70;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!groupId) return;

    const fetchPercentage = async () => {
      setLoading(true);
      setPercentage(null);
      setDisplayed(0);

      try {
        const res = await fetch(
          `https://api.reviewanalyzer.mixdev.me/Review/review-percent-positive-in-group${groupId}?neutralCoeff=0`
        );

        if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);

        const data: ApiResponse = await res.json();
        const percent = Math.max(0, Math.min(data.result ?? 0, 100));
        setPercentage(percent);
        onComplete?.(percent);

        let current = 0;
        const step = percent / 50; 
        const interval = setInterval(() => {
          current += step;
          if (current >= percent) {
            current = percent;
            clearInterval(interval);
          }
          setDisplayed(current);
        }, 20);
      } catch (err) {
        console.error(err);
        setPercentage(0);
        setDisplayed(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPercentage();
  }, [groupId, onComplete]);

  const offset = circumference - ((percentage ?? 0) / 100) * circumference;

  const getColor = () => {
    if (percentage === null) return "#4ade80";
    if (percentage < 40) return "#f87171";
    if (percentage < 70) return "#facc15"; 
    return "#4ade80"; 
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-[180px] h-[180px]">
        
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
         
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="var(--border)"
            strokeWidth={stroke}
            fill="none"
          />
          
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke={getColor()}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (displayed / 100) * circumference}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
        </svg>

        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-[var(--text)]">
            {displayed.toFixed(1)}%
          </p>
          
        </div>
      </div>

      
      {loading && (
        <p className="text-center mt-2 text-[var(--text)]/70">Загрузка...</p>
      )}
      {!loading && percentage === null && (
        <p className="text-center mt-2 text-red-500">Нет данных по этой группе</p>
      )}
    </div>
  );
}
