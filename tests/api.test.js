const request = require('supertest');
const app = require('../index');

describe('API de Tareas', () => {
  it('GET /tasks retorna todas las tareas', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('GET /tasks/:id retorna una tarea específica', async () => {
    const res = await request(app).get('/tasks/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('POST /tasks crear una nueva tarea', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Nueva tarea de prueba' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Nueva tarea de prueba');
    expect(res.body).toHaveProperty('completed', false);
  });
});

