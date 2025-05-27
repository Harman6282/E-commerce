import { Request, Response } from "express";
import { NotfoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { Address, User } from "../generated/prisma/client";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad-requests";

export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse((req as any).body);

  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: (req as any).user.id,
    },
  });

  res.json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    throw new NotfoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};

export const listAddress = async (req: Request, res: Response) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: (req as any).user.id,
    },
  });
  res.json(addresses);
};

export const updateUser = async (req: Request, res: Response) => {
  const validatedData = UpdateUserSchema.parse((req as any).body);
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddress as unknown as string,
        },
      });
    } catch (error) {
      throw new NotfoundException("User not found", ErrorCode.USER_NOT_FOUND);
    }
    if (shippingAddress.userId != (req as any).user.id) {
      throw new BadRequestsException(
        "Address does not belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG_TO_USER
      );
    }
  }
  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress as unknown as string,
        },
      });
    } catch (error) {
      throw new NotfoundException("User not found", ErrorCode.USER_NOT_FOUND);
    }
    if (billingAddress.userId != (req as any).user.id) {
      throw new BadRequestsException(
        "Address does not belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG_TO_USER
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: {
      id: (req as any).user.id,
    },
    data: validatedData,
  });

  res.json(updatedUser);
};
