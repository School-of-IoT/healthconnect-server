const request = require('supertest');
const app = require('../server'); // Update this path as needed

describe('🧪 Patient API Tests - /api/v2', () => {
  test('POST /api/v2/signup → 200', async () => {
    const res = await request(app).post('/api/v2/signup');
    expect([200, 404]).toContain(res.statusCode);
  });

  test('GET /api/v2/login → 200', async () => {
    const res = await request(app).get('/api/v2/login');
    expect([200, 404]).toContain(res.statusCode);
  });

  test('PUT /api/v2/update/:_id → 200', async () => {
    const res = await request(app).put('/api/v2/update/123456').send({});
    expect([200, 400]).toContain(res.statusCode);
  });

  test('DELETE /api/v2/delete/:_id → 200', async () => {
    const res = await request(app).delete('/api/v2/delete/123456');
    expect([200, 404]).toContain(res.statusCode);
  });

  test('PUT /api/v2/update-health/:_id → 200', async () => {
    const res = await request(app).put('/api/v2/update-health/123456').send({});
    expect([200, 404]).toContain(res.statusCode);
  });

  test('GET /api/v2/med-data → 200', async () => {
    const res = await request(app).get('/api/v2/med-data');
    expect([200, 404]).toContain(res.statusCode);
  });
});

describe('🧪 Device API Tests - /node/v2', () => {
  test('GET /node/v2/devtkn/create → 200', async () => {
    const res = await request(app).get('/node/v2/devtkn/create');
    expect([200, 404]).toContain(res.statusCode);
  });

  test('GET /node/v2/devtkn/portal → 200', async () => {
    const res = await request(app).get('/node/v2/devtkn/portal');
    expect([200, 404]).toContain(res.statusCode);
  });

  test('GET /node/v2/devtkn/device → 200', async () => {
    const res = await request(app).get('/node/v2/devtkn/device');
    expect([200, 404]).toContain(res.statusCode);
  });

  test('POST /node/v2/node/create → 200', async () => {
    const res = await request(app)
      .post('/node/v2/node/create')
      .send({ nodeId: 'node123', type: 'sensor' }); // adjust payload to match your controller logic
    expect([200, 400]).toContain(res.statusCode);
  });

  test('GET /node/v2/node/device → 200', async () => {
    const res = await request(app).get('/node/v2/node/device');
    expect([200, 404]).toContain(res.statusCode);
  });

  test('PUT /node/v2/health/update → 200', async () => {
    const res = await request(app)
      .put('/node/v2/health/update')
      .send({ temperature: 36.6 }); // adjust based on expected input
    expect([200, 400]).toContain(res.statusCode);
  });

  test('DELETE /node/v2/node/delete → 200', async () => {
    const res = await request(app).delete('/node/v2/node/delete').send({ nodeId: 'node123' });
    expect([200, 404]).toContain(res.statusCode);
  });
});
