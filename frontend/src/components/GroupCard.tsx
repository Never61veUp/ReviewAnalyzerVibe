import React from "react";
import { UploadedGroup } from "../pages/AnalysisResultPage";
import ReviewItem from "./ReviewItem";
import { useNavigate } from "react-router-dom";
import { FaEye, FaDownload, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    group: UploadedGroup;
    toggleGroup: (group: UploadedGroup) => void;
    handleExport: (groupId: string, groupName: string) => void;
    searchQuery?: string;
}

export default function GroupCard({ group, toggleGroup, handleExport, searchQuery }: Props) {
    const navigate = useNavigate();

    const positiveCount = group.reviews?.filter(r => r.label === "positive").length || 0;
    const neutralCount = group.reviews?.filter(r => r.label === "neutral").length || 0;
    const negativeCount = group.reviews?.filter(r => r.label === "negative").length || 0;

    const totalReviews = group.reviews?.length || 0;

    return (
        <div className="p-6 rounded-2xl bg-[var(--secondary)]/5 border border-[var(--input-border)]/20 shadow-md transition-all">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text)]">{group.name}</h2>
                    <p className="text-sm opacity-70">{new Date(group.date).toLocaleString("ru-RU")}</p>

                    <p className="text-sm text-[var(--text)]/70 mt-1">
                        Всего отзывов: {totalReviews}
                    </p>

                    {totalReviews > 0 && (
                        <div className="flex gap-1 mt-2 h-2 rounded-full overflow-hidden bg-white/10">
                            <div
                                className="h-2"
                                style={{
                                    width: `${(positiveCount / totalReviews) * 100}%`,
                                    backgroundColor: "#4ade80",
                                }}
                            />
                            <div
                                className="h-2"
                                style={{
                                    width: `${(neutralCount / totalReviews) * 100}%`,
                                    backgroundColor: "#facc15",
                                }}
                            />
                            <div
                                className="h-2"
                                style={{
                                    width: `${(negativeCount / totalReviews) * 100}%`,
                                    backgroundColor: "#f87171",
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-2 items-center">

                    <button
                        onClick={() => navigate(`/group/${group.id}`)}
                        title="Посмотреть детально"
                        className="p-2 bg-[var(--primary)] hover:opacity-90 text-white rounded-xl"
                    >
                        <FaEye />
                    </button>

                    <button
                        onClick={() => handleExport(group.id, group.name)}
                        title="Экспорт"
                        className="p-2 text-white rounded-xl"
                        style={{ backgroundColor: "#6bae96" }}
                    >
                        <FaDownload />
                    </button>

                    <button
                        onClick={() => toggleGroup(group)}
                        title={group.expanded ? "Скрыть" : "Открыть"}
                        className="p-2 bg-[var(--accent)]/30 hover:bg-[var(--accent)]/50 rounded-xl"
                    >
                        {group.expanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>
            </div>

            {/* Отзывы */}
            <AnimatePresence>
                {group.expanded && group.reviews && (
                    <motion.div
                        key="reviews"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="mt-4 max-h-[300px] overflow-y-auto pr-2 space-y-2"
                    >
                        {group.reviews.length > 0 ? (
                            group.reviews.map((rev) => (
                                <div key={rev.id} className="p-2 rounded-lg bg-white/5 border-b border-white/10">
                                    <ReviewItem review={rev} searchQuery={searchQuery} />
                                </div>
                            ))
                        ) : (
                            <p className="opacity-70">Нет отзывов</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
