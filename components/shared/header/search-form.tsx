"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { KeyboardEvent } from "react";
const SearchForm = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [queryValue, setQueryValue] = useState("");
  const query = searchParams.get("query");
  const limit = searchParams.get("limit");
  const router = useRouter();
  useEffect(() => {
    setQueryValue(query || "");
  }, [searchParams, query]);

  const handleSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      e.preventDefault();
      let params = {};
      if (limit) params = { ...params, limit };
      if (queryValue) params = { ...params, query: queryValue };
      if (
        pathname.includes("/admin/products") ||
        pathname.includes("/admin/orders")
      )
        router.push(
          `${pathname}?${new URLSearchParams(params).toString()}
        `
        );
      else router.push(`/products?${new URLSearchParams(params).toString()}`);
    }
  };
  return (
    <form>
      <Input
        type="search"
        placeholder="Search..."
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        onKeyDown={handleSubmit}
      />
    </form>
  );
};
export default SearchForm;
