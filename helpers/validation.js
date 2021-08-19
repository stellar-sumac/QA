const isValidId = (id) => (Number.isInteger(Number(id)));

const isValidQueryParams = (queryParam) => Number.isNaN(Number(queryParam));

const isValidBody = (body, name, email) => {
  // checks for @,
  // followed by alphanumerics for domain,
  // then a dot followed by any set of alhpanumerics,
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
  isValidId,
  isValidBody,
  isValidPhotos,
  isValidQueryParams,
};
