"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EllipsisVertical } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

const SheetMenu = ({
  menuItems,
  menuItems2,
}: {
  menuItems: ReactElement;
  menuItems2: ReactElement;
}) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          aria-label="Open menu"
          type="button"
          className="ml-auto"
          onClick={() => setOpen(true)}
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
  );
};

export default SheetMenu;
