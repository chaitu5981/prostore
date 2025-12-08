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
import { cn } from "@/lib/utils";

const CartTable = ({
  cart,
  src = "cartPage",
}: {
  cart: Cart;
  src?: string;
}) => {
  return (
    <Table
      className={cn(
        "w-full overflow-x-auto",
        src == "cartPage" ? "md:w-[70%]" : "w-full"
      )}
    >
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50%]">Item</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cart?.items.map((item) => (
          <TableRow key={item.slug}>
            <TableCell className="flex gap-3 items-center whitespace-break-spaces">
              <Image src={item.image} alt="Image" width={50} height={50} />
              <p className="wrap-break-word">{item.productName}</p>
            </TableCell>
            <TableCell>
              {src == "cartPage" ? (
                <AddToCart item={item} cart={cart} />
              ) : (
                <p className="text-center">{item.qty}</p>
              )}
            </TableCell>
            <TableCell>
              <p className="text-right">${item.price}</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default CartTable;
