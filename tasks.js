function validateDate(start, end) {
   return(start.getTime() <= end.getTime());
}

function isDate(date) {
    return (date instanceof Date && isFinite(date));
}

module.exports = { validateDate, isDate };