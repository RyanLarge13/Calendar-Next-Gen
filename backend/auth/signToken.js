import jwt from "jsonwebtoken";

const signToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET);
  return token;
};

export default signToken;
