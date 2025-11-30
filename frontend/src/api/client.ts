import { Group, GroupsResponse, Review, FileUploadResponse, ReviewResponse } from "./api";

export interface ReviewCountResponse {
  count: number;
}


export const BASE_URL = "https://api.reviewanalyzer.mixdev.me";

export async function uploadFile(file: File): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`https://api.reviewanalyzer.mixdev.me/api/Group/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки файла: ${res.status} ${res.statusText}`);
  }

  const data: FileUploadResponse = await res.json();
  return data;
}


export async function fetchGroups(): Promise<GroupsResponse> {
  const res = await fetch(`${BASE_URL}/api/Group`);

  if (!res.ok) throw new Error("Ошибка получения групп");

  return await res.json(); 
}

export async function fetchGroupReviews(groupId: string, count: number = -1): Promise<Review[]> {
  const res = await fetch(`${BASE_URL}/Review/${groupId}?count=${count}`);

  if (!res.ok) throw new Error("Ошибка получения отзывов");

  const data = await res.json();
  
  if (!Array.isArray(data.result)) {
    throw new Error("Неожиданный формат данных отзывов");
  }

  return data.result.map((r: any) => ({
    ...r,
    label: r.label === 0 ? "neutral" : r.label === 1 ? "positive" : "negative",
  }));
}


export async function fetchReviewsByTitle(title: string, count: number = -1): Promise<Review[]> {
  const res = await fetch(`${BASE_URL}/Review/by-title/${encodeURIComponent(title)}?count=${count}`);

  if (!res.ok) throw new Error("Ошибка получения отзывов по названию");

  return await res.json();
}

export async function uploadText(review: string): Promise<ReviewResponse> {
  const res = await fetch(`${BASE_URL}/Review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ review }),
  });

  if (!res.ok) throw new Error("Ошибка анализа текста");

  return await res.json();
}

export async function exportReviews(groupId: string): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/Review/export-stream?groupId=${groupId}`);

  if (!res.ok) throw new Error("Ошибка экспорта отзывов");

  return await res.blob();
}

export async function fetchReviewCount(): Promise<ReviewCountResponse> {
  try {
    const response = await fetch(
      "https://api.reviewanalyzer.mixdev.me/Review/review-count"
    );
    if (!response.ok) throw new Error("Ошибка при получении числа отзывов");

    const data = await response.json();
    return { count: data.result ?? 0 };
  } catch (err) {
    console.error("fetchReviewCount error:", err);
    return { count: 0 };
  }
}

export interface ReviewPositiveCountResponse {
  count: number;
}

export async function fetchPositiveReviewCount(): Promise<ReviewPositiveCountResponse> {
  try {
    const response = await fetch("https://api.reviewanalyzer.mixdev.me/Review/review-positive-count");
    if (!response.ok) throw new Error("Ошибка при получении числа позитивных отзывов");

    const data = await response.json();
    return { count: data.result ?? 0 };
  } catch (err) {
    console.error("fetchPositiveReviewCount error:", err);
    return { count: 0 };
  }
}
