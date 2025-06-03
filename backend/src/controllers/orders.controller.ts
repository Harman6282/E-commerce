import { Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCode } from "../exceptions/root";
import { NotfoundException } from "../exceptions/not-found";

export const createOrder = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: (req as any).user.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length == 0) {
      return res.json({ message: "cart is empty" });
    }
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);

    const address = await prismaClient.address.findFirst({
      where: {
        id: (req as any).user.defaultShippingAddress,
      },
    });

    const order = await tx.order.create({
      data: {
        userId: (req as any).user.id,
        netAmount: price,
        address: address?.formattedAddress!,
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });
    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        userId: (req as any).user.id,
      },
    });

    return res.json(order);
  });
};

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: (req as any).user.id,
    },
  });
  return res.json(orders);
};
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "CANCELED",
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: "CANCELED",
      },
    });
    res.json({ order });
  } catch (error) {
    throw new NotfoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: req.params.id,
      },
      include: {
        products: true,
        events: true,
      },
    });
    res.json({ order });
  } catch (error) {
    throw new NotfoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};

  const status = req.params.status;
  if (status) {
    whereClause = {
      status,
    };
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: +req.query.skip! || 0,
    take: 5,
  });
  res.json(orders);
};
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: req.body.status,
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: (req as any).body.status,
      },
    });
    res.json(order);
  } catch (error) {
    throw new NotfoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};
export const listUserOrders = async (req: Request, res: Response) => {
  let whereClause: any = {
    userId: req.params.id,
  };

  const status = req.query.status;
  if (status) {
    whereClause = {
      ...whereClause,
      status,
    };
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: +req.query.skip! || 0,
    take: 5,
  });
  res.json(orders);
};
