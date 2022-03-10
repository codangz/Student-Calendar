function validateDate(start, end) {
   return(start.getTime() <= end.getTime());
}

module.exports = validateDate;
