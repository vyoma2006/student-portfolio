// Settings must be in place BEFORE the app is loaded
process.env.JWT_SECRET = 'test-secret';
process.env.CACHE_ENABLED = 'false'; // so tests never see a cached response

const request = require('supertest');
const jwt = require('jsonwebtoken');

// Replace the Mongoose models with fakes so the tests need NO database
jest.mock('../models/Task', () => ({
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));
jest.mock('../models/User', () => ({
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
}));

const app = require('../app');
const Task = require('../models/Task');

// Mongoose queries can be chained (.sort().lean()) and awaited; imitate that
const query = (result) => {
    const p = Promise.resolve(result);
    p.sort = () => p;
    p.lean = () => p;
    return p;
};

const token = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET, { expiresIn: '1h' });
const auth = { Authorization: `Bearer ${token}` };

beforeEach(() => jest.clearAllMocks());

describe('GET /tasks', () => {
    test('returns 200 and the task list when logged in', async () => {
        Task.find.mockReturnValue(
            query([{ _id: 't1', title: 'Write tests', completed: false, priority: 'low' }])
        );

        const res = await request(app).get('/tasks').set(auth);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(1);
    });

    test('returns 401 when no token is sent', async () => {
        const res = await request(app).get('/tasks');

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/token missing/i);
    });

    test('returns 401 when the token is invalid', async () => {
        const res = await request(app).get('/tasks').set({ Authorization: 'Bearer not-a-real-token' });

        expect(res.statusCode).toBe(401);
    });
});

describe('GET /tasks/:id', () => {
    test('returns 404 JSON when the task does not exist', async () => {
        Task.findById.mockReturnValue(query(null));

        const res = await request(app).get('/tasks/64b7f0c2a1b2c3d4e5f60789').set(auth);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /tasks', () => {
    test('returns 400 and never reaches the database when title is missing', async () => {
        const res = await request(app).post('/tasks').set(auth).send({ description: 'no title' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Validation failed');
        expect(Task.create).not.toHaveBeenCalled();
    });
});

describe('POST /login', () => {
    test('returns 400 for a malformed email', async () => {
        const res = await request(app).post('/login').send({ email: 'nope', password: 'secret1' });

        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toContain('Email is not valid');
    });
});