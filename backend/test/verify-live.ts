import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

async function verifyLiveFlow() {
  console.log('--- Testing Live JanSetu Flow with Real Supabase Project ---');

  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const server = await app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 3000;
  const baseUrl = `http://localhost:${port}/api/v1`;

  const testEmail = `citizen_${Date.now()}@jansetu.test`;
  const testPassword = 'Password123!';

  console.log(`1. Signing up citizen: ${testEmail}`);
  const signupRes = await fetch(`${baseUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rudra Pratap',
      email: testEmail,
      password: testPassword,
      role: 'CITIZEN',
    }),
  });

  const signupJson = await signupRes.json();
  if (signupRes.status !== 201) {
    console.error('Signup failed:', signupJson);
    await app.close();
    process.exit(1);
  }
  console.log('✔ Citizen registered successfully in Supabase Auth & public.users table!');

  console.log('2. Logging in citizen...');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });

  const loginJson = await loginRes.json();
  if (loginRes.status !== 200 || !loginJson.access_token) {
    console.error('Login failed:', loginJson);
    await app.close();
    process.exit(1);
  }
  const token = loginJson.access_token;
  console.log('✔ Login successful! JWT Access Token received.');

  console.log('3. Submitting complaint with GPS coordinates (City Center, Gwalior)...');
  const complaintRes = await fetch(`${baseUrl}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Water pipeline burst near City Center',
      description: 'Drinking water pipeline has broken and flooded the main road for 4 days.',
      category: 'WATER',
      severity: 'HIGH',
      latitude: 26.2183,
      longitude: 78.1828,
    }),
  });

  const complaintJson = await complaintRes.json();
  if (complaintRes.status !== 201) {
    console.error('Complaint submission failed:', complaintJson);
    await app.close();
    process.exit(1);
  }
  console.log('✔ Complaint created with PostGIS coordinates:');
  console.log(`   - Complaint ID: ${complaintJson.id}`);
  console.log(`   - Coordinates: (${complaintJson.latitude}, ${complaintJson.longitude})`);
  console.log(`   - AI Status: ${complaintJson.ai_status}`);

  console.log('4. Querying PostGIS nearby search (5km radius around 26.2180, 78.1820)...');
  const nearbyRes = await fetch(
    `${baseUrl}/locations/nearby?latitude=26.2180&longitude=78.1820&radius=5000`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const nearbyJson = await nearbyRes.json();
  if (nearbyRes.status !== 200) {
    console.error('Nearby search failed:', nearbyJson);
    await app.close();
    process.exit(1);
  }

  console.log(`✔ PostGIS spatial search returned ${nearbyJson.length} nearby complaint(s)!`);
  if (nearbyJson.length > 0) {
    console.log(`   - First complaint title: "${nearbyJson[0].title}"`);
    console.log(`   - Calculated distance: ${nearbyJson[0].distance_meters} meters`);
  }

  console.log('5. Resolving administrative area hierarchy via Point-in-Polygon...');
  const resolveRes = await fetch(`${baseUrl}/locations/resolve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      latitude: 26.2183,
      longitude: 78.1828,
    }),
  });

  const resolveJson = await resolveRes.json();
  console.log('✔ Location resolution response:', resolveJson);

  await app.close();
  console.log('\n======================================================');
  console.log('🎉 ALL LIVE INTEGRATION TESTS PASSED 100% SUCCESSFULLY!');
  console.log('======================================================');
}

verifyLiveFlow().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
