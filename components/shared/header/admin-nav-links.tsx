"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminNavLinks = () => {
  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      label: "Products",
      href: "/admin/products",
    },
    {
      label: "Orders",
      href: "/admin/orders",
    },
    {
      label: "Users",
      href: "/admin/users",
    },
  ];
  const path = usePathname();
  return (
    <div className="flex items-center gap-4">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={cn(!path.includes(link.href) && "text-gray-400")}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};
export default AdminNavLinks;
