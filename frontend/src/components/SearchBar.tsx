import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface Props {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    onSearch: () => void;
    searching: boolean;
}

export default function SearchBar({ searchQuery, setSearchQuery, onSearch, searching }: Props) {
    const [error, setError] = useState("");

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setError("Пожалуйста, введите слово для поиска!");
            return;
        }
        setError("");
        onSearch();
    };

    const handleClear = () => {
        setSearchQuery("");
        setError("");
    };

    return (
        <div className="flex flex-col gap-1 mb-6">
            <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Поиск отзывов по ключевым словам"
                        className="
                            w-full p-2 pr-10 rounded-lg border
                            border-[var(--input-border)]
                            bg-[var(--input-background)]
                            text-[var(--text)]
                            placeholder:text-[var(--text-muted)]
                            focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                            transition-colors
                        "
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                            onClick={handleClear}
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>

                <button
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-2xl font-semibold hover:opacity-90 transition"
                    onClick={handleSearch}
                    disabled={searching}
                >
                    {searching ? "Идёт поиск..." : "Поиск"}
                </button>
            </div>

            {error && <p className="text-red-500 text-sm ml-1">{error}</p>}
        </div>
    );
}
