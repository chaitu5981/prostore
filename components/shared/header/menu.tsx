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
import AdminNavLinks from "./admin-nav-links";
import NavLinks from "./nav-links";
import SearchForm from "./search-form";

const CartBadge = async () => {
  const cart = await getCart();
  return (
    <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums absolute bg-blue-500 -right-3 -top-3">
      {cart ? cart.items && getCartQty(cart?.items) : 0}
    </Badge>
  );
};

const Menu = ({ role }: { role?: string }) => {
  const menuItems = (
    <div className="md:flex md:justify-between gap-2 md:flex-1">
      {role == "admin" ? (
        <AdminNavLinks />
      ) : role == "user" ? (
        <NavLinks />
      ) : (
        <></>
      )}
    </div>
  );
  const menuItems2 = (
    <div className="md:flex-row flex flex-col  gap-4 md:items-center md:ml-auto">
      <ModeToggle />
      <Link href="/cart" className="flex gap-1">
        <div className="relative">
          <ShoppingCartIcon size={20} />
          <Suspense fallback={<Loader size={10} />}>
            <CartBadge />
          </Suspense>
        </div>
        <p>Cart</p>
      </Link>
      {/* </Button> */}
      <UserButtonWrapper />
    </div>
  );

  return (
    <div className="md:flex-1 flex justify-between">
      <div className="items-center hidden md:flex gap-4">{menuItems}</div>
      {role == "admin" && <SearchForm />}
      <div className="items-center hidden md:flex gap-4">{menuItems2}</div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              aria-label="Open menu"
              type="button"
              className="ml-auto"
            >
              <EllipsisVertical className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-4 items-start  px-3 ">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            {menuItems}
            {menuItems2}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
export default Menu;
