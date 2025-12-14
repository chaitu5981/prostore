import Image from "next/image";
import Link from "next/link";
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
        <div className="flex gap-2 items-center">
          <Link href="/user/orders">Orders</Link>
          <Link href="/user/profile">Profile</Link>
          <Menu />
        </div>
      </div>
    </div>
  );
};
export default Header;
