import { Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (userId: string, res: Response): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined");

  const payload = { id: userId };

  
  const expiresInSeconds = process.env.JWT_EXPIRES_IN
    ? parseInt(process.env.JWT_EXPIRES_IN, 10)
    : 7 * 24 * 60 * 60; 
  const options: SignOptions = {
    expiresIn: expiresInSeconds, 
  };

  const token = jwt.sign(payload, secret, options);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: expiresInSeconds * 1000, 
  });

  return token;
};
