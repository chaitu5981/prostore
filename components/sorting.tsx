"use client";
import { useProductsLoadingContext } from "@/app/context/products-loading-provider";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
const sortTypes = ["newest", "lowest", "highest", "rating"];
const Sorting = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  let setProductsLoading: (loading: boolean) => void;
  const context = useProductsLoadingContext();
  const router = useRouter();
  if (context) setProductsLoading = context.setProductsLoading;
  const handleSort = (v: string) => {
    setProductsLoading(true);
    router.push(`/products/?${new URLSearchParams({ ...params, sort: v })}`);
  };
  return (
    <div className="flex gap-2 items-center">
      <p>Sort By:</p>
      <Select value={params.sort || "newest"} onValueChange={handleSort}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortTypes.map((s) => (
            <SelectItem key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
export default Sorting;
