import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import HeroSection from "../../components/HeroSection";
import ModeToggle from "../../components/ModeToggle";
import SingleAnalysis from "../../components/SingleAnalysis";
import BatchAnalysis from "../../components/BatchAnalysis";
import { FaSmile, FaMeh, FaFrown, FaCheckCircle } from "react-icons/fa";
import { fetchGroups, fetchReviewCount } from "../../api/client";
import { useNavigate } from "react-router-dom";

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Home() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [recentGroups, setRecentGroups] = useState<any[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [positiveReviews, setPositiveReviews] = useState<number>(0);
  const [neutralReviews, setNeutralReviews] = useState<number>(0);
  const [negativeReviews, setNegativeReviews] = useState<number>(0);

  const fetchLabelCount = async (label: number) => {
    try {
      const resp = await fetch(`https://api.reviewanalyzer.mixdev.me/Review/review-label-count?label=${label}`);
      if (!resp.ok) return 0;
      const data = await resp.json();
      return data.result ?? 0;
    } catch (err) {
      console.error(`Не удалось получить число отзывов для label=${label}:`, err);
      return 0;
    }
  };

  // --- загрузка истории ---
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await fetchGroups();
        if (Array.isArray(res)) {
          const sorted = [...res].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setRecentGroups(sorted.slice(0, 5));
        }
      } catch (err) {
        console.error("Не удалось загрузить последние группы:", err);
      }
    };
    loadGroups();
  }, []);

  // --- загрузка статистики ---
  useEffect(() => {
    const loadCounts = async () => {
      const positive = await fetchLabelCount(1);
      const neutral = await fetchLabelCount(0);
      const negative = await fetchLabelCount(2);

      setPositiveReviews(positive);
      setNeutralReviews(neutral);
      setNegativeReviews(negative);
      setTotalReviews(positive + neutral + negative);
    };
    loadCounts();
  }, []);

  const stats = [
    {
      label: "Проанализировано отзывов",
      value: totalReviews,
      icon: <FaCheckCircle size={28} className="text-[var(--primary)]" />,
      sparkline: [3, 5, 2, 8, 4, 6, 7],
    },
    {
      label: "Позитивных отзывов",
      value: positiveReviews,
      icon: <FaSmile size={28} className="text-green-400" />,
      sparkline: [60, 62, 64, 65, 66, 67, 68],
    },
    {
      label: "Нейтральных отзывов",
      value: neutralReviews,
      icon: <FaMeh size={28} className="text-yellow-400" />,
      sparkline: [10, 12, 11, 9, 14, 10, 13],
    },
    {
      label: "Негативных отзывов",
      value: negativeReviews,
      icon: <FaFrown size={28} className="text-red-400" />,
      sparkline: [5, 4, 6, 3, 5, 4, 2],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
      <HeroSection />
      <ModeToggle mode={mode} setMode={setMode} />

      <section className="flex flex-col lg:flex-row justify-center items-start gap-6 px-6 lg:px-16 mt-8">
        {mode === "single" ? (
          <SingleAnalysis textInput={textInput} setTextInput={setTextInput} />
        ) : (
          <BatchAnalysis file={file} setFile={setFile} />
        )}
      </section>

      {/* история */}
      <section className="mt-20 px-6 lg:px-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Последние анализы</h2>

        {recentGroups.length === 0 ? (
          <p className="text-center text-[var(--text)]/70">История пуста</p>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {recentGroups.map((g, idx) => (
              <motion.div
                key={g.id}
                className="p-5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-md flex justify-between items-center hover:shadow-xl transition cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div>
                  <p className="text-lg font-semibold">{g.name}</p>
                  <p className="text-sm text-[var(--text)]/60">
                    {new Date(g.date).toLocaleString()}
                  </p>
                </div>

                <span className="text-[var(--primary)] font-bold">
                  {g.reviewCount ?? 0} отзывов
                </span>
              </motion.div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/analysis-result")}
            className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold shadow hover:opacity-90 transition"
          >
            Перейти к истории
          </button>
        </div>
      </section>

      {/* статистика */}
      <section className="mt-20 px-6 lg:px-16 mb-32">
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
              <div className="mb-3">{stat.icon}</div>

              <motion.p className="text-4xl font-extrabold mb-2 text-[var(--text)]">
                <AnimatedNumber value={stat.value} />
              </motion.p>

              <p className="text-sm text-[var(--text)]/70 mb-2">{stat.label}</p>

              <svg className="w-full h-6" viewBox="0 0 100 20" preserveAspectRatio="none">
                {stat.sparkline.map((val, i) => (
                  i < stat.sparkline.length - 1 && (
                    <line
                      key={i}
                      x1={(i * 100) / (stat.sparkline.length - 1)}
                      y1={20 - (val / Math.max(...stat.sparkline)) * 20}
                      x2={((i + 1) * 100) / (stat.sparkline.length - 1)}
                      y2={20 - (stat.sparkline[i + 1] / Math.max(...stat.sparkline)) * 20}
                      stroke="var(--primary)"
                      strokeWidth="2"
                    />
                  )
                ))}
              </svg>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
