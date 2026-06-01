import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { createTestUser, loginAsUser, createTestPost } from './helpers.js';

describe('POST /posts', () => {
  let token: string;

  beforeAll(async () => {
    const user = await createTestUser();
    token = await loginAsUser(user.email, user.password);
  });

  it('debería rechazar creación sin token', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 'Título del post de prueba', content: 'Contenido del post de prueba' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ success: false });
  });

  it('debería rechazar título muy corto', async () => {
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Corto', content: 'Contenido del post de prueba con más de veinte caracteres' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ success: false, error: 'Error de validación' });
  });

  it('debería crear un post correctamente', async () => {
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Título del post de prueba', content: 'Contenido del post de prueba que tiene más de veinte caracteres' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ success: true });
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('authorId');
    expect(res.body.data.title).toBe('Título del post de prueba');
  });
});

describe('GET /posts', () => {
  it('debería devolver lista de posts', async () => {
    const res = await request(app).get('/posts');

    expect([200]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toMatchObject({ success: true });
      expect(Array.isArray(res.body.data)).toBe(true);
    }
  });
});

describe('GET /posts/:id', () => {
  let token: string;
  let postId: string;

  beforeAll(async () => {
    const user = await createTestUser();
    token = await loginAsUser(user.email, user.password);
    const post = await createTestPost(token);
    postId = post.id;
  });

  it('debería devolver un post por ID', async () => {
    const res = await request(app).get(`/posts/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true });
    expect(res.body.data.id).toBe(postId);
  });

  it('debería devolver 404 para ID inexistente', async () => {
    const res = await request(app).get('/posts/00000000-0000-0000-0000-000000000000');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false, error: 'Post no encontrado' });
  });
});

describe('PUT /posts/:id', () => {
  let token: string;
  let postId: string;

  beforeAll(async () => {
    const user = await createTestUser();
    token = await loginAsUser(user.email, user.password);
    const post = await createTestPost(token);
    postId = post.id;
  });

  it('debería actualizar el propio post', async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Título modificado del post' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true });
    expect(res.body.data.title).toBe('Título modificado del post');
  });

  it('debería rechazar actualización sin token', async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .send({ title: 'Título hackeado' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ success: false });
  });

  it('debería rechazar actualización de post inexistente', async () => {
    const res = await request(app)
      .put('/posts/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Título de prueba para update que cumple el mínimo' });

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false });
  });
});

describe('DELETE /posts/:id', () => {
  let token: string;
  let postId: string;

  beforeAll(async () => {
    const user = await createTestUser();
    token = await loginAsUser(user.email, user.password);
    const post = await createTestPost(token);
    postId = post.id;
  });

  it('debería rechazar eliminación sin token', async () => {
    const res = await request(app).delete(`/posts/${postId}`);

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ success: false });
  });

  it('debería eliminar el propio post', async () => {
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});
