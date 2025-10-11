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
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate.replace('T00:00:00.000Z', ''));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Get the current week's date range (Monday to Sunday)
 */
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