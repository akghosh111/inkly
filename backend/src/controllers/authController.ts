import { RequestHandler } from "express";




export const register: RequestHandler = async (req, res) => {
  res.send("register");
};

;

export const login: RequestHandler = async (req, res) => {
  res.send("login");
};


export const logout: RequestHandler = async (req, res) => {
  res.send("logout");
};


