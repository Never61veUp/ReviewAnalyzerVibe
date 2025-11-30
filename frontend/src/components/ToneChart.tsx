import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface Props {
    data: Record<string, number>;
}

export default function ToneChart({ data }: Props) {
    const graphData = useMemo(() => {
        if (!data) return [];
        return Object.entries(data).map(([src, percent]) => ({
            src,
            percent: Number(percent),
        }));
    }, [data]);

    console.log("Graph Data:", graphData);

    if (!graphData.length)
        return <p className="text-center text-[var(--text)]">Нет данных для графика</p>;


    const chartHeight = Math.max(300, graphData.length * 60);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full p-4"
        >

            <div style={{ width: "100%", height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={graphData}
                        layout="vertical"
                        margin={{ top: 20, right: 20, left: 80, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--grid)" />
                        <XAxis
                            type="number"
                            domain={[0, 100]}
                            stroke="var(--text)"
                            tick={{ fill: "var(--text)" }}
                        />
                        <YAxis
                            type="category"
                            dataKey="src"
                            stroke="var(--text)"
                            tick={{ fill: "var(--text)" }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "var(--tooltip-bg)",
                                backdropFilter: "blur(6px)",
                                borderRadius: "10px",
                                border: "1px solid var(--tooltip-border)",
                                color: "var(--text)",
                            }}
                            formatter={(value) => [`${value}%`, "Позитивность"]}
                            labelFormatter={(label) => `Источник: ${label}`}
                        />
                        <Bar
                            dataKey="percent"
                            radius={[4, 4, 4, 4]}
                            isAnimationActive
                            fill="url(#barGradient)"
                        />
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#33cc6a" />
                                <stop offset="50%" stopColor="#27ae60" />
                                <stop offset="100%" stopColor="#4ade80" />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.section>
    );
}
