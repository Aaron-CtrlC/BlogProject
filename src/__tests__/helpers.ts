import request from 'supertest';
import app from '../app.js';

export async function createTestUser() {
  const timestamp = Date.now();
  const email = `test-${timestamp}@example.com`;

  const res = await request(app)
    .post('/users')
    .send({ email, name: 'Usuario Test', password: 'password123' });

  return { email, password: 'password123', ...res.body.data };
}

export async function loginAsUser(email: string, password: string) {
  const res = await request(app)
    .post('/users/login')
    .send({ email, password });

  return res.body.data.token as string;
}

export async function createTestPost(token: string) {
  const res = await request(app)
    .post('/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Título del post de prueba', content: 'Contenido del post de prueba que tiene más de veinte caracteres' });

  return res.body.data;
}
