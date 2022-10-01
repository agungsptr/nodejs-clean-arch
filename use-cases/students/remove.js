const studentsDa = require("../../data-access/students");
const { ResponseWithError } = require("../../commons/errors");
const { StatusCode } = require("../../commons/constants");
const { responseBuilder } = require("../../commons/utils");

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await studentsDa.remove(id);
    res
      .status(StatusCode.OK)
      .send(responseBuilder({ statusCode: StatusCode.OK, data }));
    return next();
  } catch (e) {
    return ResponseWithError(res, e, StatusCode.BadRequest);
  }
};

module.exports = remove;
