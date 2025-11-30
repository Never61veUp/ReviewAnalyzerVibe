import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGroupReviews } from "../api/client";
import { Review } from "../api/api";
import ToneChart from "../components/ToneChart";
import SatisfactionLine from "../components/SatisfactionLine";
import PositivePercentage from "../components/PositivePercentage";
import ReviewItem from "../components/ReviewItem";

export default function GroupDetailsPage() {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [toneData, setToneData] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Загрузка отзывов
        const res = await fetchGroupReviews(id!);
        setReviews(Array.isArray(res) ? res : []);

        // Загрузка тональности
        const toneRes = await fetch(
          `https://api.reviewanalyzer.mixdev.me/Review/review-src-positive-percent${id}`
        );
        const toneJson = await toneRes.json();
        setToneData(toneJson.result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Загрузка данных...</p>;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-[var(--text)]">
        Детальный анализ группы
      </h1>

      <div className="p-6 rounded-xl bg-[var(--secondary)]/10 border border-[var(--border)]/20">
        <p className="text-lg mb-4">
          Количество отзывов: <b>{reviews.length}</b>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-xl bg-[var(--secondary)]/10 border border-[var(--border)]/20">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
            Тональность отзывов
          </h2>
          {toneData ? <ToneChart data={toneData} /> : <p>Нет данных для графика</p>}
        </div>

        <div className="p-6 rounded-xl bg-[var(--secondary)]/10 border border-[var(--border)]/20">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
            Уровень удовлетворённости
          </h2>
          <SatisfactionLine reviews={reviews} />
        </div>

        <div className="p-6 rounded-xl bg-[var(--secondary)]/10 border border-[var(--border)]/20 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
            Процент позитивных отзывов
          </h2>
          {id && <PositivePercentage groupId={id} />}
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[var(--secondary)]/10 border border-[var(--border)]/20">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
          Все отзывы
        </h2>

        {reviews.length === 0 ? (
          <p className="opacity-70">Нет отзывов</p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-4 rounded-lg border-l-4 ${
                  rev.label === "positive"
                    ? "border-green-400 bg-green-50/20"
                    : rev.label === "neutral"
                    ? "border-yellow-400 bg-yellow-50/20"
                    : "border-red-400 bg-red-50/20"
                }`}
              >
                <ReviewItem review={rev} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
