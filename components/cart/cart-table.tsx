"use client";
import { Cart, CartItem } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import AddToCart from "../shared/product/add-to-cart";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "../ui/card";
import { currencyFormatter, getCartQty } from "@/lib/utils";
import { Button } from "../ui/button";

const CartTable = ({ cart }: { cart: Cart }) => {
  return (
    <div className="flex justify-between flex-col md:flex-row gap-5">
      <Table className="w-full md:w-[70%] overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Item</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.items.map((item) => (
            <TableRow key={item.slug}>
              <TableCell className="flex gap-3 items-center whitespace-break-spaces">
                <Image src={item.image} alt="Image" width={50} height={50} />
                <p className="wrap-break-word">{item.productName}</p>
              </TableCell>
              <TableCell>
                <AddToCart item={item} cart={cart} />
              </TableCell>
              <TableCell>
                <p className="text-right">${item.price}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Card className="w-[50%] md:w-[25%]">
        <CardContent>
          <p>
            Sub Total({getCartQty(cart.items)}) :{" "}
            <span className="font-semibold">
              {currencyFormatter(cart.totalPrice)}
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Button className="whitespace-pre-wrap wrap-break-word">
            Proceed to Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default CartTable;
