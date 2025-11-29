import React, { useState, useEffect } from "react";
import { fetchGroups, fetchGroupReviews, fetchReviewsByTitle } from "../api/client";
import { Review } from "../api/api";

interface UploadedGroup {
  id: string;
  name: string;
  date: string;
  reviews?: Review[];
  expanded?: boolean;
  justUploaded?: boolean;
  reviewCount?: number;
}

export default function AnalysisResultPage() {
  const [groups, setGroups] = useState<UploadedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        const res = await fetchGroups();
        if (Array.isArray(res)) {
          let uploadedGroups: UploadedGroup[] = res.map((g) => ({
            id: g.id,
            name: g.name,
            date: g.date,
            reviewCount: g.reviewCount ?? 0,
            justUploaded: false,
          }));

          uploadedGroups = uploadedGroups.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          // только загруженная группа
          if (uploadedGroups.length > 0) {
            uploadedGroups[0].justUploaded = true;
          }

          setGroups(uploadedGroups);
        } else {
          setGroups([]);
        }
      } catch (err: any) {
        setError(err.message || "Ошибка при получении групп");
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  const toggleGroup = async (group: UploadedGroup) => {
    if (group.expanded) {
      setGroups(groups.map((g) => (g.id === group.id ? { ...g, expanded: false } : g)));
      return;
    }
    if (!group.reviews) {
      try {
        const reviews = await fetchGroupReviews(group.id);
        setGroups(
          groups.map((g) =>
            g.id === group.id ? { ...g, reviews: Array.isArray(reviews) ? reviews : [], expanded: true } : g
          )
        );
      } catch (err) {
        console.error(err);
      }
    } else {
      setGroups(groups.map((g) => (g.id === group.id ? { ...g, expanded: true } : g)));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const reviewsResponse = await fetchReviewsByTitle(searchQuery);
      const reviews: Review[] = Array.isArray(reviewsResponse)
        ? reviewsResponse
        : Array.isArray((reviewsResponse as any).result)
        ? (reviewsResponse as any).result
        : [];

      const searchGroup: UploadedGroup = {
        id: "search",
        name: `Результаты поиска: "${searchQuery}"`,
        date: new Date().toISOString(),
        reviews,
        expanded: true,
        reviewCount: reviews.length,
      };

      setGroups([searchGroup, ...groups.filter((g) => g.id !== "search")]);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleExport = async (groupId: string, groupName: string) => {
    try {
      const response = await fetch(
        `https://api.reviewanalyzer.mixdev.me/Review/export-stream?groupId=${groupId}`
      );
      if (!response.ok) throw new Error("Ошибка при экспорте CSV");
      const csv = await response.text();

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${groupName.replace(/\s+/g, "_")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Не удалось экспортировать CSV");
    }
  };

  if (loading) return <p className="text-center text-[var(--text)] mt-10">Загрузка...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Ошибка: {error}</p>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center text-[var(--text)] mb-6">История загруженных файлов</h1>

      {/* поиск */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Поиск отзывов по ключевым словам"
          className="flex-1 p-2 rounded-lg border border-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-2xl font-semibold"
          onClick={handleSearch}
          disabled={searching}
        >
          {searching ? "Идёт поиск..." : "Поиск"}
        </button>
      </div>

      {groups.map((group) => (
        <div
          key={group.id}
          className={`rounded-3xl border border-[var(--border)] shadow-[0_0_25px_var(--accent)/15] backdrop-blur-xl transition-all
            ${
              group.id === "search"
                ? "bg-[var(--primary)]/10"
                : group.justUploaded
                ? "bg-blue-100 shadow-lg"
                : "bg-[var(--background)]/40"
            }`}
        >

          <div className="flex justify-between items-center p-6">
            <div className="cursor-pointer" onClick={() => toggleGroup(group)}>
              <h2 className="text-xl font-semibold text-[var(--text)]">{group.name}</h2>
              <p className="text-sm opacity-70 text-[var(--text)]">
                Загружено: {new Date(group.date).toLocaleString()} | Отзывов: {group.reviewCount ?? 0}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-2xl font-semibold shadow hover:shadow-[0_0_25px_var(--primary)/50] transition-all"
                onClick={() => toggleGroup(group)}
              >
                {group.expanded ? "Свернуть" : "Развернуть"}
              </button>

              {group.id !== "search" && (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-2xl font-semibold shadow hover:shadow-[0_0_25px_green]/50 transition-all"
                  onClick={() => handleExport(group.id, group.name)}
                >
                  Экспорт
                </button>
              )}
            </div>
          </div>

          {/* отзывы */}
          {group.expanded && group.reviews && Array.isArray(group.reviews) && (
            <div className="p-6 border-t border-[var(--border)]/30 space-y-4">
              {group.reviews.length === 0 && <p className="text-gray-400">Нет отзывов</p>}
              {group.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-2xl bg-[var(--secondary)]/10 border border-[var(--border)]/30 shadow-[0_0_15px_var(--accent)/10]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        review.label === "positive"
                          ? "bg-green-500/20 text-green-400"
                          : review.label === "negative"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {review.label === "positive"
                        ? "Позитивный"
                        : review.label === "negative"
                        ? "Негативный"
                        : "Нейтральный"}
                    </span>
                    <span className="text-xs opacity-70">{(review.confidence * 100).toFixed(1)}% доверие</span>
                  </div>
                  <p className="text-[var(--text)] whitespace-pre-line">
                    {searchQuery
                      ? review.text.split(new RegExp(`(${searchQuery})`, "gi")).map((part, i) =>
                          part.toLowerCase() === searchQuery.toLowerCase() ? (
                            <span key={i} className="bg-yellow-200">
                              {part}
                            </span>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )
                      : review.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
