const { validatePassword } = require('./passwordFormat')

test('Password cannot include a space.', () => {
    expect(validatePassword('Hell0 123')).toBe(false)
})

test('Password must includes a digit number.', () => {
    expect(validatePassword('Hello')).toBe(false)
})

test('Password must includes an upper-case letter.', () => {
    expect(validatePassword('hello123')).toBe(false)
})

test('Password must includes an upper-case letter.', () => {
    expect(validatePassword('HELLO123')).toBe(false)
})

test('Legal Password.', () => {
    expect(validatePassword('H3ll0123')).toBe(true)
})