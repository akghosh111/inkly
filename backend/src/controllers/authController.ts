import { RequestHandler } from "express";
import { prisma } from "../config/db";
import bcrypt from "bcryptjs";
import { Role } from "../generated/enums";
import { generateToken } from "../utils/generateToken";


async function generateUsername(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")       
    .replace(/[^a-z0-9_]/g, ""); 

  let username = base;
  let count = 0;

  while (true) {
    const existing = await prisma.user.findUnique({
      where: { username },
    });
    if (!existing) break;
    count++;
    username = `${base}_${count}`;
  }

  return username;
}

export const register: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body;

 
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return res.status(400).json({ error: "User already exists with this email" });
  }

 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  const username = await generateUsername(name);

  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      username, 
      passwordHash: hashedPassword,
      role: Role.USER,
      bio: null,
      image: null,
    },
  });

  const token = generateToken(user.id, res);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    token,
  });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
        where: {email: email},
  })

  if(!user) {
        return res.status(401).json({error: "Invalid username or password"})
  }

  

  if (!user.passwordHash) {
    return res.status(401).json({ error: "User registered with OAuth, login with Google" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if(!isPasswordValid) {
        return res.status(401).json({error: "Invalid username or password"})
  }

  const token = generateToken(user.id, res);

  res.status(201).json({
        status: "success",
        data: {
            id: user.id,
            email: email
        },
        token,
    }
  )
};

export const logout: RequestHandler = async (req, res) => {
  res.send("logout");
};
