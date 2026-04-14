const assert = require('node:assert');
const { test } = require('node:test');
const {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
  messages,
} = require('../calculator.js');

// Basic operations tests (基本運算測試)

test('addition: 2 + 3 should equal 5 (加法：2 + 3 應等於 5)', () => {
  assert.strictEqual(addition(2, 3), 5);
});

test('addition: negative numbers (-5 + 3 = -2) (加法：負數)', () => {
  assert.strictEqual(addition(-5, 3), -2);
});

test('subtraction: 10 - 4 should equal 6 (減法：10 - 4 應等於 6)', () => {
  assert.strictEqual(subtraction(10, 4), 6);
});

test('subtraction: result can be negative (減法：結果可為負)', () => {
  assert.strictEqual(subtraction(3, 7), -4);
});

test('multiplication: 3 * 4 should equal 12 (乘法：3 * 4 應等於 12)', () => {
  assert.strictEqual(multiplication(3, 4), 12);
});

test('multiplication: by zero returns 0 (乘法：乘以零得零)', () => {
  assert.strictEqual(multiplication(99, 0), 0);
});

test('division: 15 / 3 should equal 5 (除法：15 / 3 應等於 5)', () => {
  assert.strictEqual(division(15, 3), 5);
});

test('division: 7 / 2 should equal 3.5 (除法：7 / 2 應等於 3.5)', () => {
  assert.strictEqual(division(7, 2), 3.5);
});

test('division: by zero throws error (除法：除以零應拋出錯誤)', () => {
  assert.throws(() => division(5, 0), /Division by zero/);
});

// Extended operations tests (擴充運算測試)

test('modulo: 10 % 3 should equal 1 (取餘數：10 % 3 應等於 1)', () => {
  assert.strictEqual(modulo(10, 3), 1);
});

test('modulo: 20 % 6 should equal 2 (取餘數：20 % 6 應等於 2)', () => {
  assert.strictEqual(modulo(20, 6), 2);
});

test('modulo: by zero throws error (取餘數：對零取餘應拋出錯誤)', () => {
  assert.throws(() => modulo(5, 0), /Modulo by zero/);
});

test('power: 2 ^ 8 should equal 256 (乘方：2 的 8 次方應等於 256)', () => {
  assert.strictEqual(power(2, 8), 256);
});

test('power: 3 ^ 3 should equal 27 (乘方：3 的 3 次方應等於 27)', () => {
  assert.strictEqual(power(3, 3), 27);
});

test('power: any number to the power of 0 is 1 (乘方：任何數的 0 次方等於 1)', () => {
  assert.strictEqual(power(5, 0), 1);
});

test('square root: √16 should equal 4 (平方根：16 的平方根應等於 4)', () => {
  assert.strictEqual(squareRoot(16), 4);
});

test('square root: √9 should equal 3 (平方根：9 的平方根應等於 3)', () => {
  assert.strictEqual(squareRoot(9), 3);
});

test('square root: √2 should be approximately 1.414 (平方根：2 的平方根約為 1.414)', () => {
  assert.ok(Math.abs(squareRoot(2) - 1.4142135623730951) < 1e-10);
});

test('square root: of negative number throws error (平方根：負數的平方根應拋出錯誤)', () => {
  assert.throws(() => squareRoot(-1), /Cannot calculate square root/);
});

// Traditional Chinese messages test (繁體中文訊息測試)

test('messages: zh-TW locale includes Traditional Chinese labels', () => {
  assert.ok(messages['zh-TW']);
  assert.strictEqual(messages['zh-TW'].addition, '加法');
  assert.strictEqual(messages['zh-TW'].subtraction, '減法');
  assert.strictEqual(messages['zh-TW'].multiplication, '乘法');
  assert.strictEqual(messages['zh-TW'].division, '除法');
  assert.strictEqual(messages['zh-TW'].modulo, '取餘數');
  assert.strictEqual(messages['zh-TW'].power, '乘方');
  assert.strictEqual(messages['zh-TW'].squareRoot, '平方根');
});
