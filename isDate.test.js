const { validateDate, isDate } = require('./tasks');

test('array is not an date ', () => {
    expect(isDate(["one", "two", "three"])).toBe(false);
})

test('foo is not a date', () => {
    expect(isDate(new Date("foo"))).toBe(false);
})

test('2022, 3, 10 is a date', () => {
    expect(isDate(new Date(2022, 3, 10))).toBe(true);
})

test('2023, 1, 11.8 is a date', () => {
    expect(isDate(new Date(2023, 1, 11.8))).toBe(true);
})

test('2023, 1, 11 (string) is a date', () => {
    expect(isDate(new Date("2023, 1, 11"))).toBe(true);
})

test('2023, 1, 11.8 (string) is not a date', () => {
    expect(isDate(new Date("2023, 1, 11.8"))).toBe(false);
})

test('2023, 1, 11.8, 10, 33, 30, 0 (string) is not a date', () => {
    expect(isDate(new Date("2023, 1, 11.8, 10, 33, 30, 0"))).toBe(false);
})

test('2023, 1, 11.8, 10, 33, 30, 0 is a date', () => {
    expect(isDate(new Date(2023, 1, 11.8, 10, 33, 30, 0))).toBe(true);
})