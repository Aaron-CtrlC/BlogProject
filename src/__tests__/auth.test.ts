import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { createTestUser, loginAsUser } from './helpers.js';

describe('Auth middleware', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const user = await createTestUser();
    userId = user.id;
    token = await loginAsUser(user.email, user.password);
  });

  it('debería rechazar request sin token', async () => {
    const res = await request(app).put(`/users/${userId}`).send({ name: 'Hacker' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ success: false, error: 'No se proporcionó token' });
  });

  it('debería rechazar token malformado', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', 'Bearer')
      .send({ name: 'Hacker' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ success: false });
  });

  it('debería rechazar token inválido', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', 'Bearer token-falso')
      .send({ name: 'Hacker' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ success: false });
  });

  it('debería aceptar token válido en PUT /users/:id', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nombre actualizado' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true });
  });
});
