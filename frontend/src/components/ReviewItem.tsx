import React from "react";
import { Review } from "../api/api";

interface Props {
  review: Review;
  searchQuery?: string;
}

export default function ReviewItem({ review, searchQuery }: Props) {
  const highlightText = (text: string, query?: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };


  const labelMap: Record<string, { text: string; color: string }> = {
    positive: { text: "Позитивный", color: "bg-green-500/20 text-green-400" },
    negative: { text: "Негативный", color: "bg-red-500/20 text-red-400" },
    neutral: { text: "Нейтральный", color: "bg-yellow-500/20 text-yellow-400" },
  };

  const { text: labelText, color: labelColor } = labelMap[review.label] ?? labelMap["neutral"];

  return (
    <div className="p-4 rounded-2xl bg-[var(--secondary)]/10 border border-[var(--border)]/30 shadow-[0_0_15px_var(--accent)/10]">
      <div className="flex justify-between items-center mb-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${labelColor}`}>
          {labelText}
        </span>
        <span className="text-xs opacity-70">{(review.confidence * 100).toFixed(1)}% доверие</span>
      </div>
      <p className="text-[var(--text)] whitespace-pre-line">{highlightText(review.text, searchQuery)}</p>
    </div>
  );
}
