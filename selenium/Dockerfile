# Используэмый образ. alpine - минимизированый образ
FROM node:13.12.0-alpine

# Задаем рабочую дерикторию внутри контейнера
WORKDIR /usr/src/app

# Копирование package*.json файлов в root
COPY package*.json ./

#Команды которые выполняются внутри контейнера
RUN npm install

# Копирование всех остальных файлов в root
COPY . .