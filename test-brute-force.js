#!/usr/bin/env node

/**
 * Script de Prueba para Protección contra Fuerza Bruta
 * Prueba los 6 escenarios esperados
 */

const http = require('http');

const API_URL = 'http://localhost:3000';
const TEST_EMAIL = `test-brute-force-${Date.now()}@example.com`;
const WRONG_PASSWORD = 'WrongPassword123!';
const CORRECT_PASSWORD = 'TestPassword123!';

let testResults = {
  passed: 0,
  failed: 0,
  scenarios: []
};

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      const body = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testScenario(number, description, testFn) {
  try {
    console.log(`\n[Escenario ${number}] ${description}`);
    const result = await testFn();
    
    if (result.passed) {
      testResults.passed++;
      console.log(`✅ PASS: ${result.message}`);
    } else {
      testResults.failed++;
      console.log(`❌ FAIL: ${result.message}`);
    }
    
    testResults.scenarios.push({ number, description, result });
  } catch (error) {
    testResults.failed++;
    console.log(`❌ ERROR: ${error.message}`);
    testResults.scenarios.push({ number, description, error: error.message });
  }
}

async function runTests() {
  console.log('==========================================');
  console.log('PRUEBAS: Protección contra Fuerza Bruta');
  console.log('==========================================');

  // Primero, crear una cuenta para las pruebas
  console.log('\n[Preparación] Registrando cuenta de prueba...');
  try {
    const registerResponse = await makeRequest('POST', '/api/auth/register', {
      email: TEST_EMAIL,
      password: CORRECT_PASSWORD,
      nombres: 'Test',
      apellidoPaterno: 'User',
      apellidoMaterno: 'BruteForce'
    });
    console.log(`Cuenta registrada: ${TEST_EMAIL}`);
  } catch (e) {
    console.log(`Nota: ${e.message}`);
  }

  // Escenario 1: Intento fallido - error normal
  await testScenario(1, 'Intento fallido #1 (debería retornar error normal)', async () => {
    const response = await makeRequest('POST', '/api/auth/login', {
      email: TEST_EMAIL,
      password: WRONG_PASSWORD
    });
    
    const passed = response.status === 401 && 
                  !response.body?.error?.includes('bloqueada') &&
                  !response.body?.error?.includes('Demasiados');
    
    return {
      passed,
      message: `Status: ${response.status}, Error: ${response.body?.error || 'N/A'}`
    };
  });

  // Escenarios 2-4: Intentos fallidos 2-4 - error normal
  for (let i = 2; i <= 4; i++) {
    await testScenario(i, `Intento fallido #${i} (debería retornar error normal)`, async () => {
      const response = await makeRequest('POST', '/api/auth/login', {
        email: TEST_EMAIL,
        password: WRONG_PASSWORD
      });
      
      const passed = response.status === 401 && 
                    !response.body?.error?.includes('Demasiados');
      
      return {
        passed,
        message: `Status: ${response.status}, Error: ${response.body?.error || 'N/A'}`
      };
    });
  }

  // Escenario 5: Intento fallido #5 - BLOQUEADO
  await testScenario(5, 'Intento fallido #5 (DEBE bloquear la cuenta)', async () => {
    const response = await makeRequest('POST', '/api/auth/login', {
      email: TEST_EMAIL,
      password: WRONG_PASSWORD
    });
    
    const passed = response.status === 429 && 
                  response.body?.error?.includes('Demasiados');
    
    return {
      passed,
      message: `Status: ${response.status}, Error: ${response.body?.error || 'N/A'}, Bloqueado hasta: ${response.body?.lockedUntil || 'N/A'}`
    };
  });

  // Escenario 6: Intento #6 - "Cuenta temporalmente bloqueada"
  await testScenario(6, 'Intento #6 (debería rechazar por bloqueo)', async () => {
    const response = await makeRequest('POST', '/api/auth/login', {
      email: TEST_EMAIL,
      password: WRONG_PASSWORD
    });
    
    const passed = response.status === 429 && 
                  response.body?.error?.includes('bloqueada');
    
    return {
      passed,
      message: `Status: ${response.status}, Error: ${response.body?.error || 'N/A'}`
    };
  });

  console.log('\n==========================================');
  console.log('RESUMEN DE RESULTADOS');
  console.log('==========================================');
  console.log(`✅ Pasadas: ${testResults.passed}`);
  console.log(`❌ Fallidas: ${testResults.failed}`);
  console.log(`Total: ${testResults.passed + testResults.failed}`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 TODAS LAS PRUEBAS PASARON');
  } else {
    console.log('\n⚠️  ALGUNAS PRUEBAS FALLARON');
  }
}

// Ejecutar con un pequeño delay para asegurar que el servidor esté listo
setTimeout(runTests, 1000);
