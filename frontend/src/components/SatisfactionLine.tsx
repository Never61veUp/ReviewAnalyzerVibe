import React, { useMemo } from "react";
import { FaSmile, FaFrown, FaMeh } from "react-icons/fa";
import { motion } from "framer-motion";
import { Review } from "../api/api";

interface Props {
  reviews: Review[];
}

export default function SatisfactionLine({ reviews }: Props) {

  const satisfaction = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;

    const total = reviews.length;
    const positive = reviews.filter(r => r.label === "positive").length;
    const neutral = reviews.filter(r => r.label === "neutral").length;

    return Math.min(100, Math.round((positive + 0.5 * neutral) / total * 100));
  }, [reviews]);

  const sentimentMap = [
    {
      name: "Негативный",
      min: 0,
      max: 40,
      gradient: "linear-gradient(90deg, #e74c3c, #ff4d4d)",
      animationScale: [1, 1.05, 1],
      animationY: [0, -4, 0],
    },
    {
      name: "Нейтральный",
      min: 41,
      max: 59,
      gradient: "linear-gradient(90deg, #f1c40f, #ffc233)",
      animationScale: [1, 1.05, 1],
      animationY: [0, -2, 0],
    },
    {
      name: "Позитивный",
      min: 60,
      max: 100,
      gradient: "linear-gradient(90deg, #33cc6a, #27ae60)",
      animationScale: [1, 1.1, 1],
      animationY: [0, -6, 0],
    },
  ];

  // определение тональности
  const currentSentiment =
    sentimentMap.find(s => satisfaction >= s.min && satisfaction <= s.max) ??
    sentimentMap[1];

  return (
    <div className="w-full h-full p-4 flex flex-col">

      <div className="relative w-full h-10 rounded-full backdrop-blur-xl border border-white/20 overflow-hidden bg-[var(--line-bg)]">

        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{
            background: currentSentiment.gradient,
            backgroundSize: "200% 100%",
            filter: "blur(4px)",
            opacity: 0.7,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            WebkitMask: `linear-gradient(90deg, white ${satisfaction}%, transparent ${satisfaction}%)`,
            mask: `linear-gradient(90deg, white ${satisfaction}%, transparent ${satisfaction}%)`,
          }}
        />

        <motion.div
          className="absolute pointer-events-none"
          style={{ left: `${satisfaction}%`, top: "6px", transform: "translateX(-50%)" }}
          animate={{ scale: currentSentiment.animationScale, y: currentSentiment.animationY }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {currentSentiment.name === "Позитивный" && <FaSmile size={32} color="var(--smile)" />}
          {currentSentiment.name === "Нейтральный" && <FaMeh size={32} color="var(--smile)" />}
          {currentSentiment.name === "Негативный" && <FaFrown size={32} color="var(--smile)" />}
        </motion.div>
      </div>

      <div className="w-full flex justify-between px-1 mt-2 text-[10px] text-[var(--text)]/60 select-none">
        {[0, 20, 40, 60, 80, 100].map(val => <span key={val}>{val}%</span>)}
      </div>

      <p className="mt-3 font-medium text-[var(--text)] text-sm">
        {`Текущее значение: ${satisfaction}%`}
      </p>
    </div>
  );
}
