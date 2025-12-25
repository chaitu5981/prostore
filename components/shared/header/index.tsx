import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import DrawerMenu from "./drawer-menu";

const Header = ({ role }: { role?: string }) => {
  return (
    <div className="border-b-2 border-gray-300">
      <div className="flex gap-4 items-center justify-between md:justify-start wrapper">
        <div className="flex gap-3 items-center">
          <DrawerMenu />
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
        </div>
        <Menu role={role} />
      </div>
    </div>
  );
};
export default Header;
