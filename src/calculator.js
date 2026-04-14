// calculator.js - Node.js CLI Calculator with Traditional Chinese support
// 計算機 - 支援繁體中文的 Node.js 命令列計算機

/**
 * Addition operation (加法)
 * @param {number} a - First number (第一個數)
 * @param {number} b - Second number (第二個數)
 * @returns {number} The sum (總和)
 */
function addition(a, b) {
  return a + b;
}

/**
 * Subtraction operation (減法)
 * @param {number} a - First number (被減數)
 * @param {number} b - Second number (減數)
 * @returns {number} The difference (差)
 */
function subtraction(a, b) {
  return a - b;
}

/**
 * Multiplication operation (乘法)
 * @param {number} a - First number (被乘數)
 * @param {number} b - Second number (乘數)
 * @returns {number} The product (積)
 */
function multiplication(a, b) {
  return a * b;
}

/**
 * Division operation (除法)
 * @param {number} a - Dividend (被除數)
 * @param {number} b - Divisor (除數)
 * @returns {number} The quotient (商)
 * @throws {Error} If divisor is zero (如果除數為零則拋出錯誤)
 */
function division(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed (不能除以零)');
  }
  return a / b;
}

/**
 * Modulo operation (取餘數)
 * @param {number} a - Dividend (被除數)
 * @param {number} b - Divisor (除數)
 * @returns {number} The remainder (餘數)
 * @throws {Error} If divisor is zero (如果除數為零則拋出錯誤)
 */
function modulo(a, b) {
  if (b === 0) {
    throw new Error('Modulo by zero is not allowed (不能對零取餘數)');
  }
  return a % b;
}

/**
 * Power/Exponentiation operation (乘方/指數運算)
 * @param {number} base - The base number (底數)
 * @param {number} exponent - The exponent (指數)
 * @returns {number} The result of base raised to exponent (底數的指數次方)
 */
function power(base, exponent) {
  return Math.pow(base, exponent);
}

/**
 * Square root operation (平方根)
 * @param {number} n - The number to find the square root of (要求平方根的數)
 * @returns {number} The square root (平方根)
 * @throws {Error} If n is negative (如果 n 為負數則拋出錯誤)
 */
function squareRoot(n) {
  if (n < 0) {
    throw new Error('Cannot calculate square root of a negative number (不能計算負數的平方根)');
  }
  return Math.sqrt(n);
}

// Traditional Chinese language messages (繁體中文訊息)
const messages = {
  'zh-TW': {
    addition: '加法',
    subtraction: '減法',
    multiplication: '乘法',
    division: '除法',
    modulo: '取餘數',
    power: '乘方',
    squareRoot: '平方根',
    result: '結果',
    error: '錯誤',
    divisionByZero: '不能除以零',
    negativeSquareRoot: '不能計算負數的平方根',
  },
};

module.exports = {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
  messages,
};
