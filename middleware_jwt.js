import jwt from "jsonwebtoken";

export const authenticateJWT = (token, callback) => {
  if (!token) {
    return callback(new Error("No token provided"), null);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return callback(new Error("Invalid or expired token."));
    }
    callback(null, decoded); // Successfully authenticated
  });
};
