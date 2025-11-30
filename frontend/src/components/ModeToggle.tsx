import React from "react";
import { FaRegFileAlt, FaRegFolder } from "react-icons/fa";

interface Props {
    mode: "single" | "batch";
    setMode: (mode: "single" | "batch") => void;
}

export default function ModeToggle({ mode, setMode }: Props) {
    return (
        <section className="flex justify-center py-8">
            <div className="flex rounded-3xl overflow-hidden shadow-lg">
                {/* Одиночный анализ */}
                <button
                    onClick={() => setMode("single")}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition-transform duration-150 transform rounded-l-2xl
                        ${mode === "single"
                            ? "bg-[var(--primary)] text-[var(--background)] shadow-[0_5px_15px_var(--primary)] scale-105"
                            : "bg-[var(--background)]/90 dark:bg-[var(--background)]/70 text-[var(--text)] shadow-inner hover:scale-105 hover:shadow-[0_2px_8px_var(--primary)]"
                        }`}
                >
                    <FaRegFileAlt /> Одиночный анализ
                </button>

                {/* Пакетный анализ */}
                <button
                    onClick={() => setMode("batch")}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition-transform duration-150 transform rounded-r-2xl
                        ${mode === "batch"
                            ? "bg-[var(--primary)] text-[var(--background)] shadow-[0_5px_15px_var(--primary)] scale-105"
                            : "bg-[var(--background)]/90 dark:bg-[var(--background)]/70 text-[var(--text)] shadow-inner hover:scale-105 hover:shadow-[0_2px_8px_var(--primary)]"
                        }`}
                >
                    <FaRegFolder /> Пакетный анализ
                </button>
            </div>
        </section>
    );
}
