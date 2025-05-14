import 'reflect-metadata';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Lama } from '../src/models/lama';
import { container } from '../src/config/container';
import { TYPES } from '../src/types/types';
import { IDatabase } from '../src/interfaces/IDatabase';
import { MONGODB_URI } from '../src/config/env';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

// Тести API вебдодатку сайту про лам
describe('API вебдодатку сайту про лам', () => {
    // Отримуємо екземпляр бази даних з контейнера
    const database = container.get<IDatabase>(TYPES.IDatabase);
    // Створюємо спеціальний URI для тестової бази даних
    const testMongoURI = MONGODB_URI.replace(/\/[^/]*$/, '/lamas-test');

    // Перед запуском тестів підключаємось до тестової бази даних
    before(async () => {
        await database.connect(testMongoURI);
        console.log('Підключено до тестової бази даних:', testMongoURI);
    });

    // Після всіх тестів очищуємо базу даних і відключаємося
    after(async () => {
        try {
            // Видаляємо тестову базу даних
            await mongoose.connection.db.dropDatabase();
            console.log('Тестову базу даних "lamas-test" успішно видалено');
        } catch (error) {
            // Обробляємо можливі помилки
            console.log(
                'Помилка видалення тестової бази даних:',
                error instanceof Error ? error.message : 'Невідома помилка',
            );
        } finally {
            // В будь-якому разі відключаємося від бази даних
            await database.disconnect();
            console.log('Відключено від тестової бази даних');
        }
    });

    // Тести для перевірки підключення до бази даних
    describe('Підключення до бази даних', () => {
        it('має перевірити підключення до тестової бази даних', () => {
            expect(database.isConnected()).to.be.true;
            expect(database.getConnectionUri()).to.equal(testMongoURI);
            console.log('Підключення до бази даних успішно перевірено');
        });
    });

    // Перед кожним тестом очищуємо колекцію лам
    beforeEach(async () => {
        await Lama.deleteMany({});
    });

    // Тести для створення запису про нову ламу (POST-запит)
    describe('POST /api/lamas', () => {
        it('має створити запис про нову ламу', done => {
            // Тестові дані лами
            const lama = {
                name: 'Вухань',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'male' as const,
                description: 'Сірий заєць',
                habitatTerritory: 10,
            };

            // Виконуємо POST-запит для створення запису про ламу
            chai.request(app)
                .post('/api/lamas')
                .send(lama)
                .end((err, res) => {
                    if (err !== null && err !== undefined) {
                        return done(err);
                    }
                    // Перевіряємо відповідь
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', lama.name);
                    expect(res.body).to.have.property('age', lama.age);
                    expect(res.body).to.have.property('height', lama.height);
                    expect(res.body).to.have.property('weight', lama.weight);
                    expect(res.body).to.have.property('gender', lama.gender);
                    expect(res.body).to.have.property('description', lama.description);
                    expect(res.body).to.have.property('dateAdded');
                    expect(res.body).to.have.property('habitatTerritory', lama.habitatTerritory);
                    expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
                    done();
                });
        });
    });

    // Тести для отримання всіх записів лам (GET-запит)
    describe('GET /api/lamas', () => {
        it('має отримати всіх лам', async () => {
            // Створюємо тестовий запис лами
            const testLama = new Lama({
                name: 'Білан',
                age: 3,
                height: 35,
                weight: 3.2,
                gender: 'male',
                description: 'Біла лама',
                habitatTerritory: 10,
            });
            await testLama.save();

            // Виконуємо GET-запит для отримання всіх записів лам
            const res = await chai.request(app).get('/api/lamas');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Білан');
            expect(res.body[0]).to.have.property('gender', 'male');
            expect(res.body[0]).to.have.property('description', 'Біла лама');
            expect(res.body[0]).to.have.property('habitatTerritory', 10);
            expect(res.body[0]).to.have.property('dateAdded');
            expect(new Date(res.body[0].dateAdded)).to.be.instanceOf(Date);
        });
    });

    // Тести для отримання запису конкретної лами за ID (GET-запит)
    describe('GET /api/lamas/:id', () => {
        it('має отримати конкретну ламу за id', async () => {
            // Створюємо запис тестової лами
            const testLama = new Lama({
                name: 'Косий',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Коричнева лама',
                habitatTerritory: 10,
            });
            const savedLama = await testLama.save();

            // Виконуємо GET-запит для отримання запису лами за ID
            const res = await chai.request(app).get(`/api/lamas/${String(savedLama._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Косий');
            expect(res.body).to.have.property('age', 1);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Коричнева лама');
            expect(res.body).to.have.property('habitatTerritory', 10);
        });

        it('має повернути 404 для неіснуючої лами', async () => {
            // Виконуємо GET-запит для неіснуючого ID лами
            const res = await chai.request(app).get('/api/lamas/654321654321654321654321');
            expect(res).to.have.status(404);
        });
    });

    // Тести для повного оновлення запису про лам (PUT-запит)
    describe('PUT /api/lamas/:id', () => {
        it('має повністю оновити запис про лам', async () => {
            // Створюємо тестового лами
            const testLama = new Lama({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                habitatTerritory: 10,
            });
            const savedLama = await testLama.save();

            // Дані для оновлення лами
            const updatedData = {
                name: 'Оновлений',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит для повного оновлення запису про ламу
            const res = await chai
                .request(app)
                .put(`/api/lamas/${String(savedLama._id)}`)
                .send(updatedData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 30);
            expect(res.body).to.have.property('weight', 2.5);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('habitatTerritory', 10);
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it("має завершитися невдачею при відсутності обов'язкових полів", async () => {
            // Створюємо тестову ламу
            const testLama = new Lama({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                habitatTerritory: 10,
            });
            const savedLama = await testLama.save();

            // Неповні дані для оновлення (відсутні обов'язкові поля)
            const incompleteData = {
                name: 'Оновлений',
                age: 2,
                // height і weight відсутні
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит з неповними даними
            const res = await chai
                .request(app)
                .put(`/api/lamas/${String(savedLama._id)}`)
                .send(incompleteData);

            // Перевіряємо, що запит завершився з помилкою
            expect(res).to.have.status(400);

            // Перевіряємо, що заєць не змінився
            const unchangedLama = await Lama.findById(savedLama._id);
            expect(unchangedLama).to.have.property('name', 'Оригінальний');
            expect(unchangedLama).to.have.property('height', 25);
            expect(unchangedLama).to.have.property('weight', 1.8);
            expect(unchangedLama).to.have.property('habitatTerritory', 10);
        });
    });

    // Тести для часткового оновлення запису про ламу (PATCH-запит)
    describe('PATCH /api/lamas/:id', () => {
        it('має частково оновити запис про лам', async () => {
            // Створюємо тестову ламу
            const testLama = new Lama({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                habitatTerritory: 10,
            });
            const savedLama = await testLama.save();

            // Дані для часткового оновлення
            const patchData = {
                name: 'Частково оновлений',
                age: 3,
                description: 'Оновлений опис',
                habitatTerritory: 25,
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/lamas/${String(savedLama._id)}`)
                .send(patchData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Частково оновлений');
            expect(res.body).to.have.property('age', 3);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(res.body).to.have.property('habitatTerritory', 25);
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it('демонструє різницю між PATCH і PUT з частковими оновленнями', async () => {
            // Створюємо тестову ламу
            const testLama = new Lama({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                habitatTerritory: 10,
            });
            const savedLama = await testLama.save();

            // Ті самі неповні дані, що не спрацювали з PUT, мають працювати з PATCH
            const partialData = {
                name: 'Оновлений',
                age: 2,
                // height і weight навмисно відсутні
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/lamas/${String(savedLama._id)}`)
                .send(partialData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            // Ці поля мають зберегти свої початкові значення
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('habitatTerritory', 10);
            expect(res.body).to.have.property('description', 'Оновлений опис');
        });
    });

    // Тести для отримання метаданих (HEAD-запит)
    describe('HEAD /api/lamas', () => {
        it('має повернути заголовки метаданих', async () => {
            // Виконуємо HEAD-запит
            const res = await chai
                .request(app)
                .head('/api/lamas')
                .set('Accept', 'application/json');

            // Перевіряємо статус відповіді
            expect(res).to.have.status(200);

            // Виводимо отримані заголовки
            console.log('Заголовки:');
            console.log('-----------------');
            Object.entries(res.headers).forEach(([key, value]) => {
                console.log(`${key}: ${String(value)}`);
            });

            // Перевіряємо наявність необхідних заголовків
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(res.headers['x-powered-by']).to.equal('Express');
            expect(res.headers['content-length']).to.equal('2');
        });
    });

    // Тести для видалення запису лам (DELETE-запит)
    describe('DELETE /api/lamas/:id', () => {
        it('має видалити запис про лам', async () => {
            // Створюємо тестового лам
            const testLama = new Lama({
                name: 'Стрибунець',
                age: 2,
                height: 28,
                weight: 2.1,
                gender: 'female',
                description: 'Чорний заєць',
                habitatTerritory: 10,
            });
            const savedLama = await testLama.save();

            // Виконуємо DELETE-запит
            const res = await chai.request(app).delete(`/api/lamas/${String(savedLama._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Запис про ламу видалено');

            // Перевіряємо, що запис про лам дійсно видалено з бази
            const findLamas = await Lama.findById(savedLama._id);
            expect(findLamas).to.be.null;
        });
    });
});
