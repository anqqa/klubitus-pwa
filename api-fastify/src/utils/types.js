/**
 * Recursively convert object's Date values to string.
 *
 * @param  {Object}  obj
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


module.exports = {
  objectDateToStr
};
