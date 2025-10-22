/**
 * Utility functions for payroll formatting and calculations
 */

/**
 * Format a number as USD currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Convert dollars to words (English)
 */
export const dollarsToWords = (amount: number): string => {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

  const convertHundreds = (num: number): string => {
    let result = '';

    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;

    if (hundreds > 0) {
      result += ones[hundreds] + ' hundred';
      if (remainder > 0) result += ' ';
    }

    if (remainder >= 20) {
      const tensPlace = Math.floor(remainder / 10);
      const onesPlace = remainder % 10;
      result += tens[tensPlace];
      if (onesPlace > 0) result += '-' + ones[onesPlace];
    } else if (remainder >= 10) {
      result += teens[remainder - 10];
    } else if (remainder > 0) {
      result += ones[remainder];
    }

    return result;
  };

  const convertThousands = (num: number): string => {
    if (num === 0) return 'zero';

    let result = '';
    const thousands = Math.floor(num / 1000);
    const hundreds = num % 1000;

    if (thousands > 0) {
      result += convertHundreds(thousands) + ' thousand';
      if (hundreds > 0) result += ' ';
    }

    if (hundreds > 0) {
      result += convertHundreds(hundreds);
    }

    return result;
  };

  const dollars = Math.floor(amount);
  const cents = Math.round((amount - dollars) * 100);

  let result = convertThousands(dollars);
  result = result.charAt(0).toUpperCase() + result.slice(1);
  result += ' dollar' + (dollars !== 1 ? 's' : '');

  if (cents > 0) {
    result += ' and ' + cents + ' cent' + (cents !== 1 ? 's' : '');
  }

  return result;
};

/**
 * Format date from ISO string to readable format
 * Handles timezone issues by parsing the date components directly
 */
export const formatDate = (isoDate: string): string => {
  // Extract date components from ISO string (YYYY-MM-DD)
  const dateOnly = isoDate.split('T')[0];
  const [year, month, day] = dateOnly.split('-').map(Number);

  // Create date using UTC to avoid timezone offset issues
  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC' // Force UTC to prevent timezone conversion
  }).format(date);
};

/**
 * Get the current week's date range (Monday to Sunday)
 */
/*
export const getCurrentWeekRange = (): { ini: string; final: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Monday start

  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    ini: formatDateForAPI(monday),
    final: formatDateForAPI(sunday)
  };
};
*/
export const getCurrentWeekRange = (): { ini: string; final: string } => {
   // Obtener la fecha actual
    const fechaActual = new Date();
    // Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const diaSemana = fechaActual.getDay();
    console.log('📆 calcularSemana - Fecha actual:', fechaActual.toDateString(), 'Día de la semana:', diaSemana);
    // Calcular el día inicial de la semana excluyendo Sábado y Domingo
    const diaInicialSemana = new Date(fechaActual);
    diaInicialSemana.setDate(fechaActual.getDate() - diaSemana + 3); // 3 representa el miércoles (0=domingo, 1=lunes, 2=martes, 3=miércoles)
    while (diaInicialSemana.getDay() === 0 || diaInicialSemana.getDay() === 6) {
        diaInicialSemana.setDate(diaInicialSemana.getDate() + 1);
    }
    // Calcular el día en que termina la semana excluyendo Sábado y Domingo
    const diaFinSemana = new Date(diaInicialSemana);
    diaFinSemana.setDate(diaInicialSemana.getDate() + 6); // 6 representa el martes
    while (diaFinSemana.getDay() === 0 || diaFinSemana.getDay() === 6) {
        diaFinSemana.setDate(diaFinSemana.getDate() + 1);
    }
    // Restar una semana a ambas fechas
    diaInicialSemana.setDate(diaInicialSemana.getDate() - 7);
    diaFinSemana.setDate(diaFinSemana.getDate() - 7);
    // Obtener los componentes de la fecha en formato "year-month-day" SIN CEROS como Flutter
const formatDateForAPI = (date: Date): string => {
  // Ajustar a hora local quitando el desfase UTC
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, '0');
  const day = String(local.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

  console.log( formatDateForAPI(diaInicialSemana),formatDateForAPI(diaFinSemana),'carol')
  return {
    ini: formatDateForAPI(diaInicialSemana),
    final: formatDateForAPI(diaFinSemana),
  };
};


export const calcularSemanaFinish = () => {
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const diaSemana = fechaActual.getDay();
    // Calcular el día inicial de la próxima semana excluyendo Sábado y Domingo
    const diaInicialProximaSemana = new Date(fechaActual);
    diaInicialProximaSemana.setDate(fechaActual.getDate() - diaSemana + 10); // 10 representa el próximo miércoles
    while (diaInicialProximaSemana.getDay() === 0 || diaInicialProximaSemana.getDay() === 6) {
        diaInicialProximaSemana.setDate(diaInicialProximaSemana.getDate() + 1);
    }
    // Calcular el día en que termina la próxima semana excluyendo Sábado y Domingo
    const diaFinProximaSemana = new Date(diaInicialProximaSemana);
    diaFinProximaSemana.setDate(diaInicialProximaSemana.getDate() + 6); // 6 representa el próximo martes
    while (diaFinProximaSemana.getDay() === 0 || diaFinProximaSemana.getDay() === 6) {
        diaFinProximaSemana.setDate(diaFinProximaSemana.getDate() + 1);
    }

    // Ajustar la fecha final para que sea un viernes
    while (diaFinProximaSemana.getDay() !== 5) { // 5 representa el viernes
        diaFinProximaSemana.setDate(diaFinProximaSemana.getDate() - 1);
    }

    // Restar una semana a ambas fechas
    diaInicialProximaSemana.setDate(diaInicialProximaSemana.getDate() - 7);
    diaFinProximaSemana.setDate(diaFinProximaSemana.getDate() - 7);

    // Obtener los componentes de la fecha en formato "year-month-day"
    const formatoDiaInicialProximaSemana = `${diaInicialProximaSemana.getFullYear()}-${(diaInicialProximaSemana.getMonth() + 1).toString().padStart(2, '0')}-${diaInicialProximaSemana.getDate().toString().padStart(2, '0')}`;
    const formatoDiaFinProximaSemana = `${diaFinProximaSemana.getFullYear()}-${(diaFinProximaSemana.getMonth() + 1).toString().padStart(2, '0')}-${diaFinProximaSemana.getDate().toString().padStart(2, '0')}`;


    console.log(formatoDiaInicialProximaSemana,formatoDiaFinProximaSemana,'Deigo1') 
   
}

export const calcularSemanaActual = () => {
    // Obtener la fecha actual
    const fechaActual = new Date();

    // Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const diaSemana = fechaActual.getDay();

    // Calcular el día inicial de la semana excluyendo Sábado y Domingo
    // Réplica exacta del JavaScript original
    const diaInicialSemana = new Date(fechaActual);
    diaInicialSemana.setDate(fechaActual.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1));
    while (diaInicialSemana.getDay() === 6 || diaInicialSemana.getDay() === 0) {
        diaInicialSemana.setDate(diaInicialSemana.getDate() + 1);
    }

    // Calcular el día en que termina la semana excluyendo Sábado y Domingo
    // +4 días desde el lunes = viernes (lunes a viernes = 5 días laborales)
    const diaFinSemana = new Date(diaInicialSemana);
    diaFinSemana.setDate(diaInicialSemana.getDate() + 4);
    while (diaFinSemana.getDay() === 6 || diaFinSemana.getDay() === 0) {
        diaFinSemana.setDate(diaFinSemana.getDate() + 1);
    }

    // Obtener los componentes de la fecha en formato "year-month-day"
    const formatoDiaInicialSemana = `${diaInicialSemana.getFullYear()}-${(diaInicialSemana.getMonth() + 1).toString().padStart(2, '0')}-${diaInicialSemana.getDate().toString().padStart(2, '0')}`;
    const formatoDiaFinSemana = `${diaFinSemana.getFullYear()}-${(diaFinSemana.getMonth() + 1).toString().padStart(2, '0')}-${diaFinSemana.getDate().toString().padStart(2, '0')}`;

    
        console.log(formatoDiaInicialSemana,formatoDiaFinSemana,'Deigo2') 
 
    
}
