# ===============================
# Этап 1: сборка приложения
# ===============================
FROM node:18 AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Сборка проекта (создаёт папку dist)
RUN npm run build

# ===============================
# Этап 2: продакшен-контейнер
# ===============================
FROM node:18 AS runner

WORKDIR /app
ENV NODE_ENV=production

# Устанавливаем serve для продакшена
RUN npm install -g serve

# Копируем package.json и node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Копируем собранный проект
COPY --from=builder /app/dist ./dist

# Экспонируем порт
EXPOSE 5173

# Запуск сервера для раздачи dist
CMD ["serve", "-s", "dist", "-l", "5173"]
