import { Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const existUser = await prismaClient.user.findFirst({
    where: { email },
  });

  if (existUser) {
    throw Error("User already exists");
  }

  const hashedPassword = hashSync(password, 10);

  const user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    success: "true",
    message: "Signed up successfully",
    user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await prismaClient.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    throw Error("User not found");
  }

  const isValidPasssword = compareSync(password, existingUser.password);

  if (!isValidPasssword) {
    throw Error("Invalid password");
  }

  const token = jwt.sign(
    {
      userId: existingUser.id,
    },
    JWT_SECRET
  );

  const user = await prismaClient.user.findUnique({
    where: { email },
    select: {
       id: true,
       name: true,
       email: true,
       createdAt: true,
       updatedAt: true,
    },
  });

  res.status(201).json({
    success: "true",
    message: "signned in",
    user,
    token,
  });
};
