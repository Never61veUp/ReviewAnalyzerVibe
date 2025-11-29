import { useState, useEffect } from "react";
import { Group, Review } from "./api";
import { fetchGroups, fetchGroupReviews } from "./client";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups()
      .then((res) => setGroups(res.result)) 
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { groups, loading, error };
}

export function useGroupReviews(groupId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;
    fetchGroupReviews(groupId)
      .then(setReviews)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [groupId]);

  return { reviews, loading, error };
}
