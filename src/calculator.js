/**
 * calculator.js
 *
 * A Node.js CLI calculator that supports the following operations:
 *   - addition
 *   - subtraction
 *   - multiplication
 *   - division
 *   - modulo (remainder)
 *   - power (exponentiation)
 *   - square root
 */

/**
 * Performs addition of two numbers.
 * @param {number} a - The first operand.
 * @param {number} b - The second operand.
 * @returns {number} The sum of a and b.
 */
function add(a, b) {
  return a + b;
}

/**
 * Performs subtraction of two numbers.
 * @param {number} a - The minuend.
 * @param {number} b - The subtrahend.
 * @returns {number} The difference of a and b.
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Performs multiplication of two numbers.
 * @param {number} a - The first factor.
 * @param {number} b - The second factor.
 * @returns {number} The product of a and b.
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Performs division of two numbers.
 * @param {number} a - The dividend.
 * @param {number} b - The divisor (must not be zero).
 * @returns {number} The quotient of a divided by b.
 * @throws {Error} If b is zero.
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

/**
 * Performs modulo (remainder) operation.
 * @param {number} a - The dividend.
 * @param {number} b - The divisor (must not be zero).
 * @returns {number} The remainder of a divided by b.
 * @throws {Error} If b is zero.
 */
function modulo(a, b) {
  if (b === 0) {
    throw new Error('Modulo by zero is not allowed');
  }
  return a % b;
}

/**
 * Raises a base to an exponent (power / exponentiation).
 * @param {number} base - The base value.
 * @param {number} exponent - The exponent value.
 * @returns {number} base raised to the power of exponent.
 */
function power(base, exponent) {
  return Math.pow(base, exponent);
}

/**
 * Calculates the square root of a number.
 * @param {number} n - The number to find the square root of.
 * @returns {number} The square root of n.
 * @throws {Error} If n is negative.
 */
function squareRoot(n) {
  if (n < 0) {
    throw new Error('Cannot calculate the square root of a negative number');
  }
  return Math.sqrt(n);
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
  squareRoot,
};
