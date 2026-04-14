/**
 * calculator.test.js
 *
 * Comprehensive unit tests for calculator.js using Node.js built-in test runner.
 * Tests cover: addition, subtraction, multiplication, division,
 * modulo, power (exponentiation), and square root operations.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
  squareRoot,
} = require('../calculator');

// ─── addition ────────────────────────────────────────────────────────────────

describe('addition', () => {
  it('adds two positive numbers', () => {
    assert.equal(add(3, 5), 8);
  });

  it('adds a positive and a negative number', () => {
    assert.equal(add(10, -4), 6);
  });

  it('adds two negative numbers', () => {
    assert.equal(add(-7, -3), -10);
  });

  it('adds zero to a number', () => {
    assert.equal(add(5, 0), 5);
  });

  it('adds floating-point numbers', () => {
    assert.ok(Math.abs(add(0.1, 0.2) - 0.3) < 1e-10);
  });
});

// ─── subtraction ─────────────────────────────────────────────────────────────

describe('subtraction', () => {
  it('subtracts two positive numbers', () => {
    assert.equal(subtract(9, 4), 5);
  });

  it('subtracts a larger number from a smaller one (negative result)', () => {
    assert.equal(subtract(3, 10), -7);
  });

  it('subtracts zero', () => {
    assert.equal(subtract(8, 0), 8);
  });
});

// ─── multiplication ──────────────────────────────────────────────────────────

describe('multiplication', () => {
  it('multiplies two positive numbers', () => {
    assert.equal(multiply(4, 5), 20);
  });

  it('multiplies by zero', () => {
    assert.equal(multiply(7, 0), 0);
  });

  it('multiplies a positive by a negative number', () => {
    assert.equal(multiply(6, -3), -18);
  });

  it('multiplies two negative numbers', () => {
    assert.equal(multiply(-4, -5), 20);
  });
});

// ─── division ────────────────────────────────────────────────────────────────

describe('division', () => {
  it('divides two positive numbers', () => {
    assert.equal(divide(10, 2), 5);
  });

  it('returns a decimal result', () => {
    assert.equal(divide(7, 2), 3.5);
  });

  it('divides a negative number', () => {
    assert.equal(divide(-9, 3), -3);
  });

  it('throws on division by zero', () => {
    assert.throws(() => divide(5, 0), /Division by zero/);
  });
});

// ─── modulo ──────────────────────────────────────────────────────────────────

describe('modulo', () => {
  it('returns the remainder of an even division', () => {
    assert.equal(modulo(10, 3), 1);
  });

  it('returns zero when evenly divisible', () => {
    assert.equal(modulo(9, 3), 0);
  });

  it('handles negative dividend', () => {
    assert.equal(modulo(-10, 3), -1);
  });

  it('throws on modulo by zero', () => {
    assert.throws(() => modulo(5, 0), /Modulo by zero/);
  });
});

// ─── power (exponentiation) ──────────────────────────────────────────────────

describe('power', () => {
  it('raises a base to a positive exponent', () => {
    assert.equal(power(2, 10), 1024);
  });

  it('returns 1 for any base raised to the power of 0', () => {
    assert.equal(power(5, 0), 1);
  });

  it('handles fractional exponents', () => {
    assert.equal(power(4, 0.5), 2);
  });

  it('handles negative exponents', () => {
    assert.equal(power(2, -1), 0.5);
  });
});

// ─── square root ─────────────────────────────────────────────────────────────

describe('square root', () => {
  it('returns the correct square root of a perfect square', () => {
    assert.equal(squareRoot(25), 5);
  });

  it('returns the correct square root of a non-perfect square', () => {
    assert.ok(Math.abs(squareRoot(2) - Math.SQRT2) < 1e-10);
  });

  it('returns 0 for the square root of 0', () => {
    assert.equal(squareRoot(0), 0);
  });

  it('throws on square root of a negative number', () => {
    assert.throws(() => squareRoot(-1), /negative/);
  });
});
