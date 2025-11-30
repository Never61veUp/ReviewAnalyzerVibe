import React from "react";
import { FaFileAlt, FaChartBar, FaChartLine, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      title: "Ввод текста или файла",
      description:
        "Вы можете вставить текст напрямую или загрузить файл с отзывами для анализа.",
      icon: <FaFileAlt />,
    },
    {
      title: "Анализ тональности",
      description:
        "Система определяет позитивные, нейтральные и негативные сообщения, рассчитывает общий рейтинг удовлетворенности.",
      icon: <FaChartBar />,
    },
    {
      title: "Визуализация результатов",
      description:
        "Вы получаете графики, процент позитивных сообщений и историю последних отзывов в удобном виде.",
      icon: <FaChartLine />,
    },
    {
      title: "Действия по результатам",
      description:
        "Используйте данные для улучшения работы с клиентами, выявления проблемных зон и повышения качества сервиса.",
      icon: <FaRocket />,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] py-16 px-6 lg:px-20">
      <h1
        className="text-3xl lg:text-4xl font-bold text-center mb-12"
        style={{ color: "var(--primary)" }}
      >
        Как это работает
      </h1>

      <div className="relative max-w-4xl mx-auto pl-12">
        <div
          className="absolute left-5 top-0 bottom-0 w-1 rounded"
          style={{
            background: `linear-gradient(to bottom, var(--primary), var(--accent), var(--secondary))`,
          }}
        />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="relative mb-12"
          >
            <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg z-10">
              {step.icon}
            </div>

            <div className="pl-16 p-6 rounded-3xl backdrop-blur-xl bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-md hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1">
              <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
              <p className="text-[var(--text)]/80">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
