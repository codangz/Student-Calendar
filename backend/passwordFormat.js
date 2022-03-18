function validatePassword(password) {
    if (password.includes(' ')) return false;
    if (password.match(/[0-9]/) == null) return false;
    if (password.match(/[A-Z]/) == null) return false;
    if (password.match(/[a-z]/) == null) return false;
    return true;
}

module.exports = { validatePassword }