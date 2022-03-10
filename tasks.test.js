const validateDate = require('./tasks');

test('1987-02-11 is before 1989-07-10', () => {
  expect(validateDate(new Date(1987, 1, 11), new Date(1989, 6, 10))).toBe(true)
})

test('2022-02-11 is after 1989-07-10', () => {
  expect(validateDate(new Date(2022, 1, 11), new Date(1989, 6, 10))).toBe(false)
})

test('2021-02-11 is after 2021-01-10', () => {
  expect(validateDate(new Date(2021, 1, 11), new Date(2021, 0, 10))).toBe(false)
})

test('2022-03-09 is the same 2022-03-09', () => {
  expect(validateDate(new Date(2022, 2, 9), new Date(2022, 2, 9))).toBe(true)
})

test('2022-01-01 is before 2022-02-01', () => {
  expect(validateDate(new Date(2022, 0, 1), new Date(2022, 1, 1))).toBe(true)
})

test('1999-02-18 is after 1989-02-18', () => {
  expect(validateDate(new Date(1999, 1, 18), new Date(1989, 1, 18))).toBe(false)
})

test('2000-07-18 is before 2002-05-15', () => {
  expect(validateDate(new Date(2000, 6, 18), new Date(2002, 4, 15))).toBe(true)
})
