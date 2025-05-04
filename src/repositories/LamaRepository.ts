import { injectable } from 'inversify';
import { Lama, ILama } from '../models/lama';

// Клас-репозиторій для роботи з ламами
// Анотація injectable дозволяє впровадити цей репозиторій через IoC контейнер
@injectable()
export class LamaRepository {
    // Метод для отримання всіх лам з бази даних
    public async findAll(): Promise<ILama[]> {
        return Lama.find();
    }

    // Метод для пошуку лам за унікальним ідентифікатором
    public async findById(id: string): Promise<ILama | null> {
        return Lama.findById(id);
    }

    // Метод для створення нового лам в базі даних
    public async create(lamaData: ILama): Promise<ILama> {
        const lama = new Lama(lamaData);
        return lama.save();
    }

    // Метод для видалення лам за ідентифікатором
    public async delete(id: string): Promise<boolean> {
        const result = await Lama.findByIdAndDelete(id);
        return result !== null;
    }

    // Метод для повного оновлення даних про лам (заміна всіх полів)
    public async update(id: string, lamaData: ILama): Promise<ILama | null> {
        return Lama.findByIdAndUpdate(id, lamaData, { new: true });
    }

    // Метод для часткового оновлення даних про лам (оновлення лише вказаних полів)
    public async patch(id: string, lamaData: Partial<ILama>): Promise<ILama | null> {
        return Lama.findByIdAndUpdate(id, { $set: lamaData }, { new: true });
    }
}
