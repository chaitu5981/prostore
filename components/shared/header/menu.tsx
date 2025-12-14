import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { EllipsisVertical, ShoppingCartIcon, UserIcon } from "lucide-react";
import { Sheet, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { getCart } from "@/lib/actions/cart.actions";
import { getCartQty } from "@/lib/utils";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import UserButtonWrapper from "./user-button-wrapper";

const CartBadge = async () => {
  const cart = await getCart();
  return (
    <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums absolute bg-blue-500 -right-3 -top-3">
      {cart ? cart.items && getCartQty(cart?.items) : 0}
    </Badge>
  );
};

const Menu = () => {
  const menuItems = (
    <>
      <ModeToggle />
      <Button asChild variant={"ghost"}>
        <Link href="/cart">
          <div className="relative">
            <ShoppingCartIcon />
            <Suspense fallback={<Loader size={10} />}>
              <CartBadge />
            </Suspense>
          </div>
          Cart
        </Link>
      </Button>
      <UserButtonWrapper />
    </>
  );
  return (
    <div>
      <div className="items-center gap-2 hidden md:flex">{menuItems}</div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              aria-label="Open menu"
              type="button"
            >
              <EllipsisVertical className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-4 items-start  px-3 ">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            {menuItems}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
export default Menu;
