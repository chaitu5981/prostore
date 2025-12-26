import Loader from "@/components/Loader";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getCategories } from "@/lib/actions/products.actions";
import { SquareMenu } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const DrawerMenuContent = async () => {
  const categories = await getCategories();
  return (
    <div className="flex flex-col">
      <DrawerHeader>
        <DrawerTitle>Select a Category</DrawerTitle>
      </DrawerHeader>
      {categories &&
        categories.length > 0 &&
        categories.map((c) => (
          <DrawerClose key={c.category} asChild>
            <Link
              href={`/products?category=${c.category}`}
              className="ml-4 my-1"
            >
              {c.category + "(" + c._count + ")"}
            </Link>
          </DrawerClose>
        ))}
    </div>
  );
};

const DrawerMenu = () => {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <SquareMenu size={30} />
      </DrawerTrigger>
      <Suspense fallback={<Loader size={50} />}>
        <DrawerContent className="h-full mr-auto max-w-sm">
          <DrawerMenuContent />
        </DrawerContent>
      </Suspense>
    </Drawer>
  );
};
export default DrawerMenu;
