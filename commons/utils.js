const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { StatusCode } = require("./constants");

const responseBuilder = ({ statusCode, message, data = null }) => {
  const status = statusCode === StatusCode.OK ? "Success" : "Failed";
  return {
    statusCode,
    status,
    message,
    data,
  };
};

const queriesBuilder = (queries, eqlType = "EQ") => {
  const obj = {};
  for (const [key, val] of Object.entries(queries)) {
    if (eqlType === "EQ") {
      obj[key] = { $eq: val };
    } else {
      obj[key] = { $regex: val, $options: "i" };
    }
  }
  return obj;
};

const serializer = (_serializeSingle) => {
  return (data) => {
    if (!data) return null;
    if (Array.isArray(data)) {
      return data.map(_serializeSingle);
    }
    return _serializeSingle(data);
  };
};

const hashPassword = (password) => {
  const saltRounds = config.bcrypt.salt;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const issueJwt = (payload, userSecretUuid = "") => {
  return jwt.sign(payload, `${config.jwt.secretKey}${userSecretUuid}`, {
    expiresIn: config.jwt.expired,
  });
};

const tokenSplitter = (token) => {
  const splitted = token.split(" ");
  if (!token || (splitted && splitted.length !== 2)) {
    return false;
  }
  return splitted;
};

const verifyJwt = (token, userSecretUuid, cb) => {
  const secretKey = `${config.jwt.secretKey}${userSecretUuid}`;
  return jwt.verify(token, secretKey, {}, (err, decoded) => {
    if (err) {
      if (err.message.includes("invalid signature")) {
        return cb(null, err.message.replace(" ", "-"));
      }
      return cb(null, "invalid-token");
    }
    return cb(decoded);
  });
};

const objHierarchyMapper = (obj, childs, value, i = 0) => {
  if (i === childs.length - 1) {
    obj[childs[i]] = value;
  } else {
    obj[childs[i]] = {};
    obj = objHierarchyMapper(obj[childs[i]], childs, value, i + 1);
  }
  return obj;
};

const sanitizerPayload = (payload) => {
  delete payload.createdBy;
  delete payload.createdAt;
  delete payload.updatedAt;
  return payload;
};

module.exports = {
  responseBuilder,
  queriesBuilder,
  serializer,
  hashPassword,
  comparePassword,
  issueJwt,
  verifyJwt,
  objHierarchyMapper,
  sanitizerPayload,
  tokenSplitter,
};
