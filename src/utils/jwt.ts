import jwt from "jsonwebtoken";

const SECRET: string = process.env.JWT_SECRET || "super-secret";

export const encrypt = (payload: object) => {
   return jwt.sign(payload, SECRET, { expiresIn: "7d" });
};

export const decrypt = (token: string) => {
   try {
      return jwt.verify(token, SECRET);
   } catch (err) {
      return null;
   }
};