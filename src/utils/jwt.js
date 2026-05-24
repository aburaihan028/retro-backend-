import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      phone: user.phone,
    },
    process.env.ACCESTOKEN_SECRECT,
    { expiresIn: process.env.ACCESTOKEN_EXPIRE },
  );
};
export const generateREFRESHTOKEN = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESHTOKEN_SECRECT,
    { expiresIn: process.env.REFRESHTOKEN_EXPIRE },
  );
};
