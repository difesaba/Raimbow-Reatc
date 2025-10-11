/**
 * 🧪 Script de prueba para verificar los servicios de billing
 *
 * IMPORTANTE: Este archivo es para desarrollo/debugging.
 * Ejecuta llamadas reales al API para verificar las respuestas.
 *
 * Para usar:
 * 1. Importar este archivo en un componente temporal
 * 2. Llamar a testAllServices() en un useEffect
 * 3. Revisar la consola del navegador para ver los resultados
 */

import { UserService } from './user.service';
import { PayrollService } from './payroll.service';
import { getCurrentWeekRange } from '../utils/payroll.utils';

/**
 * 🧪 Probar el servicio de usuarios
 */
export const testUserService = async () => {
  console.log('🧪 === PROBANDO USER SERVICE ===');

  try {
    // Test 1: Obtener todos los usuarios
    console.log('📡 Test 1: Obteniendo todos los usuarios...');
    const users = await UserService.getAllUsers();
    console.log('✅ Usuarios obtenidos:', {
      total: users.length,
      sample: users.slice(0, 3),
      estructura: users[0] ? Object.keys(users[0]) : 'Sin usuarios'
    });

    // Test 2: Obtener un usuario específico (si hay usuarios)
    if (users.length > 0) {
      const testUserId = users[0].UserId;
      console.log(`📡 Test 2: Obteniendo usuario con ID ${testUserId}...`);
      try {
        const user = await UserService.getUserById(testUserId);
        console.log('✅ Usuario obtenido:', user);
      } catch (error) {
        console.log('⚠️ getUserById no disponible o falló:', error);
      }
    }

    // Test 3: Convertir a opciones para select
    console.log('📡 Test 3: Convirtiendo usuarios a opciones...');
    const options = UserService.toUserOptions(users.slice(0, 5));
    console.log('✅ Opciones generadas:', options);

    return { success: true, users };
  } catch (error) {
    console.error('❌ Error en UserService:', error);
    return { success: false, error };
  }
};

/**
 * 🧪 Probar el servicio de nómina con un empleado
 */
export const testPayrollService = async () => {
  console.log('🧪 === PROBANDO PAYROLL SERVICE ===');

  try {
    // Obtener rango de semana actual
    const weekRange = getCurrentWeekRange();
    console.log('📅 Rango de fechas actual:', weekRange);

    // Test 1: Obtener nómina semanal
    console.log('📡 Test 1: Obteniendo nómina semanal...');
    const weeklyPayroll = await PayrollService.getWeeklyPayroll(weekRange);
    console.log('✅ Nómina semanal obtenida:', {
      total: weeklyPayroll.length,
      sample: weeklyPayroll.slice(0, 3),
      estructura: weeklyPayroll[0] ? Object.keys(weeklyPayroll[0]) : 'Sin registros'
    });

    // Test 2: Obtener detalle de un empleado (si hay empleados en la nómina)
    if (weeklyPayroll.length > 0) {
      const testEmployeeId = weeklyPayroll[0].IdUser;
      console.log(`📡 Test 2: Obteniendo detalle del empleado ${testEmployeeId}...`);
      const details = await PayrollService.getEmployeeDetails(testEmployeeId, weekRange);
      console.log('✅ Detalle del empleado obtenido:', {
        dias: details.length,
        sample: details.slice(0, 2),
        estructura: details[0] ? Object.keys(details[0]) : 'Sin detalles'
      });
    }

    return { success: true, weeklyPayroll };
  } catch (error) {
    console.error('❌ Error en PayrollService:', error);
    return { success: false, error };
  }
};

/**
 * 🧪 Ejecutar todas las pruebas
 */
export const testAllServices = async () => {
  console.log('🚀 === INICIANDO PRUEBAS DE SERVICIOS ===');
  console.log('⏰ Timestamp:', new Date().toISOString());

  // Probar UserService
  const userResult = await testUserService();

  // Esperar un poco entre pruebas
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Probar PayrollService
  const payrollResult = await testPayrollService();

  // Resumen
  console.log('📊 === RESUMEN DE PRUEBAS ===');
  console.log('UserService:', userResult.success ? '✅ EXITOSO' : '❌ FALLÓ');
  console.log('PayrollService:', payrollResult.success ? '✅ EXITOSO' : '❌ FALLÓ');

  // Verificar estructura de interfaces
  if (userResult.success && userResult.users && userResult.users.length > 0) {
    console.log('📝 === ESTRUCTURA DE USER (para verificar interface) ===');
    console.log('Campos encontrados:', Object.keys(userResult.users[0]));
    console.log('Muestra completa:', userResult.users[0]);
  }

  if (payrollResult.success && payrollResult.weeklyPayroll && payrollResult.weeklyPayroll.length > 0) {
    console.log('📝 === ESTRUCTURA DE PAYROLL (para verificar interface) ===');
    console.log('Campos encontrados:', Object.keys(payrollResult.weeklyPayroll[0]));
    console.log('Muestra completa:', payrollResult.weeklyPayroll[0]);
  }

  console.log('✨ === PRUEBAS COMPLETADAS ===');

  return {
    userService: userResult,
    payrollService: payrollResult
  };
};

/**
 * 🧪 Función helper para probar en consola del navegador
 *
 * Uso en consola:
 * window.testServices = testAllServices;
 * await window.testServices();
 */
if (typeof window !== 'undefined') {
  (window as any).testBillingServices = testAllServices;
  console.log('💡 Tip: Ejecuta "await window.testBillingServices()" en la consola para probar los servicios');
}