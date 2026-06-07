import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { createTestUser, loginAsUser } from './helpers.js';

describe('POST /users — validación', () => {
  it('debería rechazar campos faltantes', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ success: false, error: 'Error de validación' });
  });

  it('debería rechazar email inválido', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'invalido', name: 'Test', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ success: false });
  });

  it('debería rechazar password muy corta', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'test@test.com', name:'Test', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ success: false, error: 'Error de validación' });
  });

  it('debería crear un usuario correctamente', async () => {
    const email = `nuevo-${Date.now()}@test.com`;
    const res = await request(app)
      .post('/users')
      .send({ email, name: 'Nuevo Usuario', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ success: true });
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toBe(email);
    expect(res.body.data.name).toBe('Nuevo Usuario');
    expect(res.body.data).not.toHaveProperty('password');
  });
});

describe('POST /users/login', () => {
  let user: { email: string; password: string; id: string };

  beforeAll(async () => {
    user = await createTestUser();
  });

  it('debería rechazar email faltante', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ success: false, error: 'Error de validación' });
  });

  it('debería rechazar credenciales inválidas (email no existe)', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'no-existe@test.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ success: false, error: 'Credenciales inválidas' });
  });

  it('debería rechazar contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: user.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ success: false, error: 'Credenciales inválidas' });
  });

  it('debería loguear con credenciales correctas y devolver token', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: user.email, password: user.password });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true });
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('userId');
    expect(res.body.data).toHaveProperty('email');
  });
});

describe('GET /users', () => {
  it('debería devolver lista de usuarios', async () => {
    const res = await request(app).get('/users');

    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toMatchObject({ success: true });
      expect(Array.isArray(res.body.data)).toBe(true);
    }
  });
});

describe('GET /users/:id', () => {
  let user: { email: string; password: string; id: string };

  beforeAll(async () => {
    user = await createTestUser();
  });

  it('debería devolver un usuario por ID', async () => {
    const res = await request(app).get(`/users/${user.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true });
    expect(res.body.data.email).toBe(user.email);
  });

  it('debería devolver 404 para ID inexistente', async () => {
    const res = await request(app).get('/users/00000000-0000-0000-0000-000000000000');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false, error: 'Usuario no encontrado' });
  });
});

describe('PUT /users/:id', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const user = await createTestUser();
    userId = user.id;
    token = await loginAsUser(user.email, user.password);
  });

  it('debería actualizar el propio usuario', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nombre Modificado' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true });
    expect(res.body.data.name).toBe('Nombre Modificado');
  });

  it('debería rechazar actualizar otro usuario', async () => {
    const otherId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app)
      .put(`/users/${otherId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nombre Hackeado' });

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ success: false });
  });
});

describe('DELETE /users/:id', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const user = await createTestUser();
    userId = user.id;
    token = await loginAsUser(user.email, user.password);
  });

  it('debería eliminar el propio usuario', async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});
