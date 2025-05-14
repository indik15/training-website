// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про Лам',
        version: '1.0.0',
        description: 'Документація API для Сайту про Лам',
    },
    // Налаштування серверів для тестування API
    servers: [
        {
            url:
                process.env.CODESPACE_NAME !== undefined
                    ? `https://${process.env.CODESPACE_NAME}-5000.app.github.dev`
                    : 'http://localhost:5000',
            description: 'Development server',
        },
    ],
    // Визначення роутерів API та операцій з ними
    paths: {
        '/api/lamas': {
            // GET запит для отримання всіх лам
            get: {
                summary: 'Отримати всіх лам',
                responses: {
                    '200': {
                        description: 'Список всіх лам',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Lama' },
                                },
                            },
                        },
                    },
                },
            },

            // POST запит для створення нової лам
            post: {
                summary: 'Створити нову ламу',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Lama' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: "Створений об'єкт лами",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Lama' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного лам за ID
        '/api/lamas/{id}': {
            // GET запит для отримання лам за ID
            get: {
                summary: 'Отримати ламу за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID лами',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт лами",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Lama' },
                            },
                        },
                    },
                    '404': { description: 'Ламу не знайдено' },
                },
            },

            // PUT запит для повного оновлення лами за ID
            put: {
                summary: 'Повністю оновити ламу',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID лами',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Lama' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт лами",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Lama' },
                            },
                        },
                    },
                    '404': { description: 'Ламу не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення лами за ID
            patch: {
                summary: 'Частково оновити ламу',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID лами',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Lama' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт лами",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Lama' },
                            },
                        },
                    },
                    '404': { description: 'Ламу не знайдено' },
                },
            },
            // DELETE запит для видалення даних про ламу за ID
            delete: {
                summary: 'Видалити дані про ламу',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID лами',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Ламу не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта Заєць
            Lama: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'gender', 'habitatTerritory'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я лами",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік лами у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота лами в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага лами в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать лами',
                    },
                    description: {
                        type: 'string',
                        description: "Опис лами (необов'язкове поле)",
                    },
                    habitatTerritory: {
                        type: 'number',
                        description: 'Площа території проживання лами (у квадратних метрах)',
                    },
                },
            },
        },
    },
};
