# Project Structure

## Структура NestJS проекта

```
delta-changes-backend/
├── src/
│   ├── core/                    # Основной функционал приложения
│   │   ├── database/            # Prisma / Database
│   │   │   ├── prisma.service.ts
│   │   │   ├── database.module.ts
│   │   │   └── index.ts
│   │   ├── core.module.ts       # Core модуль (Config, Database)
│   │   └── index.ts
│   ├── modules/                 # Бизнес-модули
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── common/                  # Общие утилиты, декораторы, фильтры
│   │   └── index.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma            # Схема Prisma
├── test/                        # Тесты
├── package.json
└── tsconfig.json
```

## Модули

- **CoreModule** - глобальный модуль с базовой инфраструктурой (Config, Database)
- **DatabaseModule** - подключение Prisma, управление соединением
- **UsersModule** - пример бизнес-модуля (заглушка)

## Команды

```bash
# Установка зависимостей
yarn install

# Генерация Prisma клиента
yarn prisma:generate

# Миграции
yarn prisma:migrate

# Prisma Studio
yarn prisma:studio

# Запуск dev
yarn start:dev
```

## Переменные окружения

Скопируй `.env.example` в `.env` и настрой:

```
DATABASE_URL="postgresql://user:password@localhost:5432/delta_changes?schema=public"
PORT=3000
NODE_ENV=development
```
