import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Menu from "./menu";

const Header = () => {
  return (
    <div className="border-b-2 border-gray-300">
      <div className="flex-between wrapper">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={48}
            height={48}
            priority
          />
          <span className="h3-bold hidden lg:block">Prostore</span>
        </Link>
        <Menu />
      </div>
    </div>
  );
};
export default Header;
