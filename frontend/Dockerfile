# Этап 1: сборка приложения
FROM node:18 AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем проект
COPY . .

# Сборка проекта (создаёт папку dist)
RUN npm run build

# Этап 2: продакшен-контейнер
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Копируем package.json и node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Копируем собранный проект
COPY --from=builder /app/dist ./dist

# Экспонируем порт
EXPOSE 5173

# Запуск Vite preview на всех интерфейсах
CMD ["npx", "vite", "preview", "--host", "0.0.0.0"]
