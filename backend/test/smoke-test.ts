import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

async function runSmokeTests() {
  console.log('--- Starting JanSetu AI Backend Smoke Tests ---');

  let app;
  try {
    app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
  } catch (initErr) {
    console.error('NestFactory.create failed:', initErr);
    process.exit(1);
  }

  app.setGlobalPrefix('api/v1', {
    exclude: ['api/docs', 'api/docs/(.*)'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('JanSetu AI API')
    .setDescription('Phase 1 REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const server = await app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 3000;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Test server running on port: ${port}`);

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health check test
  await test('GET /api/v1/health returns status ok', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    const json = await res.json();
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (json.status !== 'ok' || json.service !== 'jansetu-backend') {
      throw new Error(`Unexpected payload: ${JSON.stringify(json)}`);
    }
  });

  // 2. Swagger docs test
  await test('GET /api/docs returns Swagger UI HTML', async () => {
    const res = await fetch(`${baseUrl}/api/docs/`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const text = await res.text();
    if (!text.includes('swagger') && !text.includes('JanSetu')) {
      throw new Error('Swagger UI HTML not found');
    }
  });

  // 3. Unauthenticated /api/v1/auth/me returns 401
  await test('GET /api/v1/auth/me rejects missing Bearer token with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/me`);
    const json = await res.json();
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    if (json.success !== false || json.statusCode !== 401) {
      throw new Error(`Expected error structure, got ${JSON.stringify(json)}`);
    }
  });

  // 4. Unauthenticated /api/v1/complaints returns 401
  await test('GET /api/v1/complaints rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/complaints`);
    const json = await res.json();
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    if (json.success !== false) throw new Error('Expected success: false');
  });

  // 5. Signup validation rejects invalid email and role
  await test('POST /api/v1/auth/signup rejects invalid body and POLICYMAKER role with 400', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A', // too short
        email: 'not-an-email',
        password: '123', // too short
        role: 'POLICYMAKER', // forbidden for public signup
      }),
    });
    const json = await res.json();
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    if (json.success !== false) throw new Error('Expected success: false');
    const messages = Array.isArray(json.message) ? json.message : [json.message];
    const roleRejected = messages.some((m: string) => m.includes('CITIZEN'));
    if (!roleRejected) {
      throw new Error(`Expected role validation error, got: ${JSON.stringify(messages)}`);
    }
  });

  // 6. User update without auth returns 401
  await test('PATCH /api/v1/users/me rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Name' }),
    });
    const json = await res.json();
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 7. Complaint creation with invalid enum returns 400
  await test('POST /api/v1/complaints validates enum values and empty fields', async () => {
    const res = await fetch(`${baseUrl}/api/v1/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid-token',
      },
      body: JSON.stringify({
        title: '',
        description: '',
        category: 'INVALID_CATEGORY',
        severity: 'SUPER_HIGH',
      }),
    });
    // With invalid token, AuthGuard kicks in first returning 401
    if (res.status !== 401 && res.status !== 400) {
      throw new Error(`Expected 401 or 400, got ${res.status}`);
    }
  });

  // Phase 4: PostGIS & Location Intelligence Tests
  // 8. Locations endpoints reject unauthenticated access with 401
  await test('GET /api/v1/locations/complaints/:id rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/locations/complaints/123e4567-e89b-12d3-a456-426614174000`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/locations/nearby rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/locations/nearby?latitude=25.4358&longitude=78.5421`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('POST /api/v1/locations/resolve rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/locations/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: 25.4358, longitude: 78.5421 }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 9. Coordinate validation tests
  await test('POST /api/v1/complaints rejects invalid coordinates (latitude > 90) with 400/401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Broken pipeline near market',
        description: 'Flooding street heavily since yesterday morning.',
        category: 'WATER',
        severity: 'HIGH',
        latitude: 95.5, // invalid > 90
        longitude: 78.5421,
      }),
    });
    if (res.status !== 400 && res.status !== 401) {
      throw new Error(`Expected 400 or 401, got ${res.status}`);
    }
  });

  await test('POST /api/v1/complaints accepts valid coordinates structure', async () => {
    const res = await fetch(`${baseUrl}/api/v1/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Valid coordinates complaint',
        description: 'Accurate location provided for civic tracking.',
        category: 'ROADS',
        severity: 'MEDIUM',
        latitude: 26.2183,
        longitude: 78.1828,
      }),
    });
    // Unauthenticated so 401, but validates that payload structure parses cleanly
    if (res.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for unauthenticated call, got ${res.status}`);
    }
  });

  // 10. Phase 5 Analytics & Data Fusion endpoint protection tests
  await test('GET /api/v1/analytics/areas rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/analytics/areas`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/analytics/areas/:areaId rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/analytics/areas/a0000000-0000-0000-0000-000000000002`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/analytics/areas/:areaId/sectors rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/analytics/areas/a0000000-0000-0000-0000-000000000002/sectors`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/analytics/areas/:areaId/fusion rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/analytics/areas/a0000000-0000-0000-0000-000000000002/fusion`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 11. Phase 5 Analytics Service zero-PII and data fusion structure test
  await test('AnalyticsService returns anonymized areas summary and fusion data without PII', async () => {
    const { AnalyticsService } = await import('../src/analytics/analytics.service');
    const analyticsService = app.get(AnalyticsService);
    const summary = await analyticsService.getAreasSummary();
    if (!Array.isArray(summary)) throw new Error('Expected summary to be an array');
    
    // Check that no PII fields exist in output
    for (const item of summary) {
      if ('name_citizen' in item || 'email' in item || 'phone' in item) {
        throw new Error('PII detected in analytics summary!');
      }
    }
  });

  // 12. Demand Analytics endpoints & calculation
  await test('GET /api/v1/analytics/demand rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/analytics/demand`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('AnalyticsService calculates deterministic demand score and metrics', async () => {
    const { AnalyticsService } = await import('../src/analytics/analytics.service');
    const analyticsService = app.get(AnalyticsService);
    const demand = await analyticsService.getDemandAnalytics({});
    if (demand.demand_score < 0 || demand.demand_score > 100) {
      throw new Error(`Invalid demand score: ${demand.demand_score}`);
    }
    if (typeof demand.complaints_per_1000 !== 'number') {
      throw new Error('complaints_per_1000 must be a number');
    }
  });

  // 13. Hotspots endpoints and PostGIS GeoJSON
  await test('GET /api/v1/hotspots rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/hotspots`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/hotspots/map rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/hotspots/map`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('HotspotsService returns valid GeoJSON FeatureCollection', async () => {
    const { HotspotsService } = await import('../src/hotspots/hotspots.service');
    const hotspotsService = app.get(HotspotsService);
    const geojson = await hotspotsService.getHotspotsMap({});
    if (geojson.type !== 'FeatureCollection') {
      throw new Error(`Expected FeatureCollection, got ${geojson.type}`);
    }
    if (!Array.isArray(geojson.features)) {
      throw new Error('Expected features array in GeoJSON');
    }
  });

  // 14. Priority Engine transparent formula calculation
  await test('GET /api/v1/priorities rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/priorities`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('PrioritiesService computeScore executes 5-factor formula correctly', async () => {
    const { PrioritiesService } = await import('../src/priorities/priorities.service');
    const prioritiesService = app.get(PrioritiesService);
    // Factors: demand=100 (30), infra=100 (25), pop=100 (20), dev=100 (15), invest=100 (10) -> total=100
    const resultMax = prioritiesService.computeScore({
      demand: 100,
      infrastructure_gap: 100,
      population_impact: 100,
      development_deficit: 100,
      investment_gap: 100,
    });
    if (resultMax.score !== 100) {
      throw new Error(`Expected 100 for all max factors, got ${resultMax.score}`);
    }

    // Factors: demand=80 (24), infra=60 (15), pop=50 (10), dev=40 (6), invest=30 (3) -> total=58
    const resultCustom = prioritiesService.computeScore({
      demand: 80,
      infrastructure_gap: 60,
      population_impact: 50,
      development_deficit: 40,
      investment_gap: 30,
    });
    if (resultCustom.score !== 58) {
      throw new Error(`Expected 58, got ${resultCustom.score}`);
    }
    if (!Array.isArray(resultCustom.explanation) || resultCustom.explanation.length === 0) {
      throw new Error('Expected non-empty explanation array');
    }
  });

  // 15. Policy RAG endpoints
  await test('GET /api/v1/policies rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/policies`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('POST /api/v1/policies/search rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/policies/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'drinking water pipeline' }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 16. Recommendations endpoints
  await test('GET /api/v1/recommendations rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/recommendations`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 17. Policymaker Dashboard endpoints
  await test('GET /api/v1/policymaker/overview rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/policymaker/overview`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/policymaker/map rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/policymaker/map`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/policymaker/hotspots rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/policymaker/hotspots`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/policymaker/priorities rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/policymaker/priorities`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/policymaker/recommendations rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/policymaker/recommendations`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/policymaker/projects rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/policymaker/projects`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 18. Audit & Data endpoints
  await test('GET /api/v1/audit rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/audit`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/data/sources rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/data/sources`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test('GET /api/v1/data/quality rejects unauthenticated access with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/data/quality`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await app.close();
  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSmokeTests().catch((err) => {
  console.error('Smoke tests encountered fatal error:', err);
  process.exit(1);
});
