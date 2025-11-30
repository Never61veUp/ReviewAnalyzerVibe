import React, { useState, useEffect } from "react";
import { fetchGroups, fetchGroupReviews, fetchReviewsByTitle } from "../api/client";
import { Review } from "../api/api";
import SearchBar from "../components/SearchBar";
import GroupCard from "../components/GroupCard";

export interface UploadedGroup {
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

          if (uploadedGroups.length > 0) uploadedGroups[0].justUploaded = true;

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

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        searching={searching}
      />

      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          toggleGroup={toggleGroup}
          handleExport={handleExport}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}
