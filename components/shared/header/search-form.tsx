"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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

  const handleSubmit = () => {
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
  };

  const handleMouseDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="gap-1 flex items-center">
        <Input
          type="search"
          placeholder="Search..."
          value={queryValue}
          onChange={(e) => setQueryValue(e.target.value)}
          onKeyDown={handleMouseDown}
          className="w-[150px] md:w-[200px] lg:w-[400px]"
        />
        <Button type="submit">
          <Search />
        </Button>
      </div>
    </form>
  );
};
export default SearchForm;
