import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotfoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Product } from "../generated/prisma/client";
import { prismaClient } from "..";

export const addItemCart = async (req: Request, res: Response) => {

    // check for the existance of the same product in the cart and update the quantity
  const validatedData = CreateCartSchema.parse(req.body);
  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });

    const cart = await prismaClient.cartItem.create({
      data: {
        userId: (req as any).user?.id,
        productId: product.id,
        quantity: validatedData.quantity,
      },
    });

    res.json(cart);
  } catch (error) {
    throw new NotfoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const deleteItemFromCart = async (req: Request, res: Response) => {

    // check the user is deleting his own cart item

    await prismaClient.cartItem.delete({
        where:{ 
            id: req.params.id
        }
    })

    res.json({success: true})
};

export const changeQuantity = async (req: Request, res: Response) => {
    const validatedData = ChangeQuantitySchema.parse(req.body);
    const updatedCart = await prismaClient.cartItem.update({
        where:{
            id: req.params.id
        },
        data:{
            quantity: validatedData.quantity
        }
    })

    res.json(updatedCart)
};
export const getCart = async (req: Request, res: Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: (req as any).user.id,
        },
        include: {
            product: true,
        },
    });
    res.json({cart: cart});
};
