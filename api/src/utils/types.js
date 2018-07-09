/**
 * Recursively convert object's Date values to string.
 *
 * @param  {Object}  obj
 * @return  {Object}
 */
const objectDateToStr = obj => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      if (obj[key] instanceof Date) {
        obj[key] = obj[key].toISOString();
      }
      else if (obj[key]) {
        objectDateToStr(obj[key]);
      }
    }
  });

  return obj;
};


/**
 * Converts string date presentation without timezone to Date in UTC.
 *
 * @param  {string}  str
 * @return  {Date}
 */
const stringToDateUTC = str => {
  if (!str) {
    return;
  }

  const ts = new Date(str);

  return new Date(Date.UTC(
    ts.getFullYear(), ts.getMonth(), ts.getDate(),
    ts.getHours(), ts.getMinutes(), ts.getSeconds(),
  ));
};




module.exports = {
  objectDateToStr,
  stringToDateUTC,
};
