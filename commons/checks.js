const CustomError = require("./customError");

const IsArray = (obj) => {
  return Array.isArray(obj);
};

const IsEmpty = (obj) => {
  if (Array.isArray(obj) && obj.length === 0) {
    return true;
  } else {
    if (
      obj === null ||
      obj === undefined ||
      typeof obj === "undefined" ||
      obj === "" ||
      obj === "undefined"
    ) {
      return true;
    }
  }
  return false;
};

const IsTrue = (obj) => {
  return obj === true || obj === "true";
};

const IsEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(Trim(email.toLowerCase(), true));
};

const IfEmptyThrowError = (obj, errorMsg) => {
  if (IsEmpty(obj)) {
    throw new CustomError(errorMsg);
  }
};

const IfFalseThrowError = (flag, errorMsg) => {
  if (flag === false) {
    throw new CustomError(errorMsg);
  }
};

const IfNotEmptyThrowError = (responseError, errorMsg) => {
  if (!IsEmpty(responseError)) {
    throw new CustomError(errorMsg);
  }
};

const IfTrueThrowError = (flag, errorMsg) => {
  if (flag === true) {
    throw new CustomError(errorMsg);
  }
};

const ImageFileTypeIsValid = (file) => {
  return (
    file &&
    file.mimetype !== "image/png" &&
    file.mimetype !== "image/jpg" &&
    file.mimetype !== "image/jpeg"
  );
};

module.exports = {
  IsArray,
  IsEmpty,
  IsTrue,
  IsEmail,
  IfEmptyThrowError,
  IfNotEmptyThrowError,
  IfTrueThrowError,
  IfFalseThrowError,
  ImageFileTypeIsValid,
};
