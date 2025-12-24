"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { KeyboardEvent } from "react";
const SearchForm = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [queryValue, setQueryValue] = useState("");
  const query = searchParams.get("query");
  const limit = searchParams.get("limit") || "3";
  const page = searchParams.get("page") || "1";
  const router = useRouter();
  useEffect(() => {
    setQueryValue(query || "");
  }, [searchParams]);
  const handleSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      console.log("Queryvalue", queryValue);
      e.preventDefault();
      router.push(
        `${pathname}?page=${page}&limit=${limit}${
          queryValue ? "&query=" + queryValue : ""
        }`
      );
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
