import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGroupReviews } from "../api/client";
import { Review } from "../api/api";
import ToneChart from "../components/ToneChart";
import SatisfactionLine from "../components/SatisfactionLine";
import PositivePercentage from "../components/PositivePercentage";
import ReviewItem from "../components/ReviewItem";

interface LabelCounts {
  positive: number;
  neutral: number;
  negative: number;
}

export default function GroupDetailsPage() {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [toneData, setToneData] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  const [labelCounts, setLabelCounts] = useState<LabelCounts>({
    positive: 0,
    neutral: 0,
    negative: 0,
  });
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const res = await fetchGroupReviews(id);
        setReviews(Array.isArray(res) ? res : []);

        const toneRes = await fetch(
          `https://api.reviewanalyzer.mixdev.me/Review/review-src-positive-percent${id}`
        );
        if (!toneRes.ok) {
          console.error("Ошибка загрузки тональности:", toneRes.status);
          setToneData(null);
        } else {
          const toneJson = await toneRes.json();
          setToneData(toneJson.result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    const loadLabelCounts = async () => {
      if (!id) return;
      setLoadingCounts(true);

      try {
        const fetchCount = async (label: number) => {
          const res = await fetch(
            `https://api.reviewanalyzer.mixdev.me/Review/review-label-count-in-group${id}?label=${label}`
          );
          if (!res.ok) return 0;
          const data = await res.json();
          return data.result ?? 0;
        };

        const positive = await fetchCount(1);
        const neutral = await fetchCount(0);
        const negative = await fetchCount(2);

        setLabelCounts({ positive, neutral, negative });
      } catch (err) {
        console.error(err);
        setLabelCounts({ positive: 0, neutral: 0, negative: 0 });
      } finally {
        setLoadingCounts(false);
      }
    };

    loadLabelCounts();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Загрузка данных...</p>;
const handleBack = () => {
    window.history.back();
  };

  const handleExportCSV = async () => {
    if (!id) return;
    try {
      const res = await fetch(
        `https://api.reviewanalyzer.mixdev.me/Review/export-stream?groupId=${id}`
      );
      if (!res.ok) throw new Error("Ошибка при экспорте CSV");
      const csv = await res.text();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reviews_${id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Ошибка при экспорте CSV");
    }
  };
  return (
    
    <div className="p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
        >
          ← Назад
        </button>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
        >
          Экспорт CSV
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-[var(--text)]">
        Детальный анализ группы
      </h1>

      <div className="p-6 rounded-xl bg-[var(--secondary)]/10 border border-[var(--border)]/20">
        <p className="text-lg mb-4">
          Количество отзывов: <b>{reviews.length}</b>
        </p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-[var(--text)]/70">
            Общее количество отзывов, загруженных для выбранной группы.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[var(--secondary)]/10 border border-[var(--border)]/20">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
          Распределение отзывов по типу
        </h2>

        {loadingCounts ? (
          <p>Загрузка...</p>
        ) : (
          <div className="flex gap-4">
            <div className="flex-1 p-4 rounded-xl bg-green-100 text-green-800 font-semibold text-center">
              Положительные: {labelCounts.positive}
            </div>
            <div className="flex-1 p-4 rounded-xl bg-yellow-100 text-yellow-800 font-semibold text-center">
              Нейтральные: {labelCounts.neutral}
            </div>
            <div className="flex-1 p-4 rounded-xl bg-red-100 text-red-800 font-semibold text-center">
              Отрицательные: {labelCounts.negative}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <p className="text-sm text-[var(--text)]/70">
            Показывает количество отзывов каждого типа.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-xl bg-[var(--secondary)]/10 border border-[var(--border)]/20">
  <h2 className="text-xl font-semibold mb-2 text-[var(--text)]">
    Уровень удовлетворённости
  </h2>

  <p className="text-sm text-[var(--text)]/70 mb-4 leading-tight">
    Линейный график изменения удовлетворённости по отзывам во времени.
  </p>

  <SatisfactionLine reviews={reviews} />
</div>


        <div className="p-6 rounded-xl bg-[var(--secondary)]/10 border border-[var(--border)]/20">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
            Процент позитивных отзывов
          </h2>

          {id && <PositivePercentage groupId={id} />}

          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-[var(--text)]/70">
              Визуальное отображение доли позитивных отзывов.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[var(--secondary)]/10 border border-[var(--border)]/20">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
          Тональность отзывов
        </h2>

        {toneData ? <ToneChart data={toneData} /> : <p>Нет данных для графика</p>}

        <div className="flex items-center gap-2 mt-2">
          <p className="text-sm text-[var(--text)]/70">
            Линейный график изменения тональности отзывов по источникам.
          </p>
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
