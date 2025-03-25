import jwt from "jsonwebtoken";

export const authenticateJWT = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error("No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(new Error("Invalid or expired token."));
      }
      resolve(decoded); // Successfully authenticated
    });
  });
};
