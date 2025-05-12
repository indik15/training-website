import { Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "Лама"
interface ILama {
    name: string; // Ім'я лами
    age: number; // Вік лами у роках
    height: number; // Висота лами в сантиметрах
    weight: number; // Вага лами в кілограмах
    gender: 'male' | 'female'; // Стать лами: 'male' - самець, 'female' - самка
    description?: string; // Опис лами (необов'язкове поле)
    dateAdded: Date; // Дата додавання запису до бази даних
    habitatTerritory: number;
}

// Схема MongoDB для моделі "Лама"
const lamaSchema = new Schema<ILama>({
    name: {
        type: String,
        requced: true, // Поле є обов'язковим
    },
    age: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    height: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    weight: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    gender: {
        type: String,
        required: true, // Поле є обов'язковим
        enum: ['male', 'female'], // Допустимі значення: 'male' або 'female'
    },
    description: String, // Необов'язкове текстове поле
    dateAdded: {
        type: Date,
        default: Date.now, // Значення за замовчуванням - поточна дата і час
    },
    habitatTerritory: {
        type: Number,
        default: 0,
        required: true, // Поле є обов'язковим
    },
});

// Створення моделі Mongoose на основі схеми
export const Lama = model<ILama>('Lama', lamaSchema);
export type { ILama }; // Експортуємо інтерфейс для використання в інших файлах
