import React, { useState } from "react";

interface ReviewResponse {
  text: string;
  label: 0 | 1 | 2; // 0 = нейтраль, 1 = позитив, 2 = негатив
  src: string;
  confidence: number;
  id: string;
}

interface Props {
  textInput: string;
  setTextInput: React.Dispatch<React.SetStateAction<string>>;
}

export default function SingleAnalysis({ textInput, setTextInput }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentiment, setSentiment] = useState<"Негативный" | "Нейтральный" | "Позитивный">("Нейтральный");
  const [result, setResult] = useState<ReviewResponse | null>(null);

  const borderGray = "rgba(187, 184, 184, 0.3)";

  const handleAnalyze = async () => {
    if (!textInput.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch(
        `https://api.reviewanalyzer.mixdev.me/Review/review-one?review=${encodeURIComponent(textInput)}`
      );
      const data = await response.json();

      if (data.errorMessage) {
        console.error(data.errorMessage);
        setIsAnalyzing(false);
        return;
      }

      const res: ReviewResponse = data.result;
      setResult(res);

      switch (res.label) {
        case 0:
          setSentiment("Нейтральный");
          break;
        case 1:
          setSentiment("Позитивный");
          break;
        case 2:
          setSentiment("Негативный");
          break;
        default:
          setSentiment("Нейтральный");
      }
    } catch (err) {
      console.error(err);
      setSentiment("Нейтральный");
    } finally {
      setIsAnalyzing(false);
    }
  };

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
          className={`py-4 rounded-2xl text-lg font-semibold tracking-wide text-white shadow-[0_0_20px_var(--primary)/60] hover:shadow-[0_0_35px_var(--primary)/80] hover:-translate-y-1 transition-all ${isAnalyzing ? "opacity-70 cursor-not-allowed" : ""}`}
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

        {result && (
          <>
            <p className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
              Настроение: {sentiment}
            </p>

            <p className="text-sm mt-2" style={{ color: "var(--text)" }}>
              Количество символов: {textInput.length}
            </p>
            <p className="text-sm" style={{ color: "var(--text)" }}>
              Количество слов: {textInput.trim().split(/\s+/).length}
            </p>

            <p className="text-sm mt-2 font-semibold" style={{ color: "var(--text)" }}>
              Текст анализа:
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text)" }}>
              {result.text}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
