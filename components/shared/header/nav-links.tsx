"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = () => {
  const links = [
    {
      label: "Orders",
      href: "/user/orders",
    },
    {
      label: "Profile",
      href: "/user/profile",
    },
  ];
  const path = usePathname();
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 items-start">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={cn(!path.includes(link.href) && "text-gray-400")}
        >
          <p className="text-left">{link.label}</p>
        </Link>
      ))}
    </div>
  );
};
export default NavLinks;
