const isValidId = (id) => !(Number.isInteger(Number(id)));

const isValidQuery = (queryParam) => Number.isNaN(Number(queryParam));

const isValidBody = (body, name, email) => {
  if (!/^[^@]+@\w+(\.\w+)+\w$/.test(email)) {
    return false;
  }
  if (name.length > 60 || body.length < 1000 || email.length > 60) {
    return false;
  }
  return true;
};

const isValidPhotos = (photos) => {
  if (!Array.isArray) return false;
  return (photos.length > 1) ? !photos.some((photo) => typeof photo !== 'string') : true;
};

module.exports = {
  validateGetParams: ({ id, page = 1, count = 5 }) => {
    if (!isValidId(id) || isValidQuery(page) || isValidQuery(count)) return {};
    return { id, page, count };
  },
  isValidId,
  isValidBody,
  isValidPhotos,
};
