// function validate(schema) {
//   return (req, res, next) => {
//     const result = schema.safeParse(req.body);

//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: result.error.issues.map((issue) => ({
//           field: issue.path.join("."),
//           message: issue.message,
//         })),
//       });
//     }

//     req.body = result.data;
//     next();
//   };
// }

// module.exports = validate;
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
    }

    req.body = value;
    next();
  };
}

module.exports = validate;