import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { LamaRepository } from '../repositories/LamaRepository';

// Створюємо новий роутер Express
const router = Router();
// Отримуємо екземпляр репозиторію лам з контейнера інверсії залежностей
const lamaRepository = container.get(LamaRepository);

// Роутер для HTTP метода GET / - отримання всіх записів лам
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи лам з бази даних через репозиторій
        const lamas = await lamaRepository.findAll();
        res.json(lamas);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода GET /:id - отримання запису однієї лами за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук лами за ідентифікатором
        const lama = await lamaRepository.findById(req.params.id);
        if (lama) {
            res.json(lama);
        } else {
            // Якщо лама не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис лами не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода POST / - створення нового запису лами
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис лам з даних запиту
        const newLama = await lamaRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеної лами
        res.status(201).json(newLama);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода PUT /:id - повне оновлення запису лами
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        // Перевірка наявності всіх обов'язкових полів для PUT запиту
        const requiredFields = ['name', 'age', 'height', 'weight', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        // Якщо є відсутні поля, повертаємо помилку 400 Bad Request
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }

        // Оновлюємо ламу з вказаним ID
        const lama = await lamaRepository.update(req.params.id, req.body);
        if (lama) {
            return res.json(lama);
        } else {
            // Якщо лама не знайдена, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис лами не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода PATCH /:id - часткове оновлення запису лами
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису лами - передаються лише ті поля, які потрібно змінити
        const lama = await lamaRepository.patch(req.params.id, req.body);
        if (lama) {
            res.json(lama);
        } else {
            // Якщо лама не знайдена, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис лами не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода DELETE /:id - видалення запису лами
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про ламу за ID
        const lama = await lamaRepository.delete(req.params.id);
        if (lama) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про ламу видалено' });
        } else {
            // Якщо лама не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про ламу не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
