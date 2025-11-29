import React, { useState } from "react";
import { FaSmile, FaFrown, FaMeh } from "react-icons/fa";

interface Review {
  id: string;
  text: string;
  label: "positive" | "neutral" | "negative";
  confidence: number;
}

interface Group {
  id: string;
  name: string;
  date: string;
  generalScore: number;
  reviews: Review[];
}

interface Props {
  textInput: string;
  setTextInput: React.Dispatch<React.SetStateAction<string>>;
  onAnalyze?: () => void;
}

export default function SingleAnalysis({ textInput, setTextInput }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [displaySatisfaction, setDisplaySatisfaction] = useState(0);
  const [sentiment, setSentiment] = useState<"Негативный" | "Нейтральный" | "Позитивный">(
    "Нейтральный"
  );
  const [group, setGroup] = useState<Group | null>(null);

  const mockAnalyze = (text: string) => {
    const wordsCount = text.trim().split(/\s+/).length;
    const charsCount = text.trim().length;

    // Мок: процент положительных отзывов = 50 + (кол-во символов % 50)
    const percentagePositiveReview = Math.min(100, 50 + (charsCount % 50));

    // Мок: создаём фейковые отзывы
    const reviews: Review[] = [
      { id: "1", text: `Текст длиной ${charsCount} символов`, label: "positive", confidence: percentagePositiveReview / 100 },
      { id: "2", text: `Количество слов: ${wordsCount}`, label: "neutral", confidence: 0.6 },
      { id: "3", text: "Пример негативного отзыва", label: "negative", confidence: 0.4 },
    ];

    const group: Group = {
      id: "g1",
      name: "Фейковая группа",
      date: new Date().toISOString(),
      generalScore: reviews.reduce((sum, r) => sum + r.confidence, 0) / reviews.length,
      reviews,
    };

    return { percentagePositiveReview, groups: [group] };
  };

  const handleAnalyze = async () => {
    if (!textInput.trim()) return;

    setIsAnalyzing(true);
    setDisplaySatisfaction(0);

    const interval = setInterval(() => {
      setDisplaySatisfaction((prev) => Math.min(prev + 2, 90));
    }, 30);

    try {
      // Мокаем анализ текста
      const result = mockAnalyze(textInput);
      clearInterval(interval);

      const percent = result.percentagePositiveReview;
      setDisplaySatisfaction(percent);

      if (percent > 60) setSentiment("Позитивный");
      else if (percent < 40) setSentiment("Негативный");
      else setSentiment("Нейтральный");

      setGroup(result.groups[result.groups.length - 1] || null);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setDisplaySatisfaction(0);
      setSentiment("Нейтральный");
      setGroup(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sentimentBg = {
    Позитивный: "rgba(39, 174, 96, 0.15)",
    Нейтральный: "rgba(128, 128, 128, 0.15)",
    Негативный: "rgba(231, 76, 60, 0.15)",
  }[sentiment];

  const borderGray = "rgba(187, 184, 184, 0.3)";

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto">
      {/* Левый блок */}
      <div
        className="flex flex-col gap-4 w-full lg:w-1/2 p-6 rounded-3xl border backdrop-blur-xl shadow-[0_0_25px_var(--accent)/15]"
        style={{ backgroundColor: "var(--background)/40", borderColor: borderGray }}
      >
        <textarea
          placeholder="Введите текст для анализа..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-full p-5 rounded-2xl border shadow-inner focus:outline-none transition min-h-[220px] resize-none"
          style={{ backgroundColor: "var(--background)/30", borderColor: borderGray, color: "var(--text)" }}
        />
        <button
          className={`py-4 rounded-2xl text-lg font-semibold tracking-wide text-white shadow-[0_0_20px_var(--primary)/60] hover:shadow-[0_0_35px_var(--primary)/80] hover:-translate-y-1 transition-all ${
            isAnalyzing ? "opacity-70 cursor-not-allowed" : ""
          }`}
          style={{ backgroundColor: "var(--primary)" }}
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Анализ..." : "Проанализировать"}
        </button>
      </div>

      {/* Правый блок */}
      <div
        className="flex flex-col w-full lg:w-1/2 p-6 rounded-3xl border backdrop-blur-xl shadow-[0_0_25px_var(--accent)/15]"
        style={{ backgroundColor: "var(--background)/40", borderColor: borderGray }}
      >
        <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--accent)" }}>
          Результат
        </h3>

        <div className="flex items-center justify-center text-xl font-bold py-2 px-4 rounded-xl mb-4" style={{ backgroundColor: sentimentBg, color: "var(--text)" }}>
          {sentiment === "Позитивный" && <FaSmile className="mr-2" style={{ color: "var(--primary)" }} />}
          {sentiment === "Нейтральный" && <FaMeh className="mr-2" style={{ color: "gray" }} />}
          {sentiment === "Негативный" && <FaFrown className="mr-2" style={{ color: "#e74c3c" }} />}
          {sentiment}
        </div>

        <div className="mb-4">
          <p className="text-sm mb-1" style={{ color: "var(--accent)" }}>
            Уверенность модели: {displaySatisfaction}%
          </p>
          <div className="w-full h-4 rounded-full overflow-hidden" style={{ backgroundColor: "var(--secondary)/30" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${displaySatisfaction}%`,
                background: "linear-gradient(90deg, #e74c3c, #f1c40f, #27ae60)",
                boxShadow: "0 0 10px rgba(39, 174, 96,0.5)",
              }}
            ></div>
          </div>
        </div>

        {group && (
          <div className="mt-4 p-3 rounded-xl border" style={{ backgroundColor: "var(--secondary)/10", borderColor: borderGray }}>
            <p className="text-sm" style={{ color: "var(--text)" }}>Название группы: {group.name}</p>
            <p className="text-sm" style={{ color: "var(--text)" }}>Дата: {new Date(group.date).toLocaleString()}</p>
            <p className="text-sm" style={{ color: "var(--text)" }}>Общий скор отзывов: {Math.round(group.generalScore * 100)}%</p>
            <p className="text-sm mt-2 font-semibold" style={{ color: "var(--text)" }}>Отзывы:</p>
            {group.reviews.map((r) => (
              <div key={r.id} className="text-sm mt-1">
                <span className="font-medium">{r.label.toUpperCase()}:</span> {r.text} (Уверенность: {Math.round(r.confidence * 100)}%)
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
