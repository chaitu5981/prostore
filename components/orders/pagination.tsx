"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const Pagination = ({ noOfPages }: { noOfPages: number }) => {
  const limits = [3, 5, 10, 20];
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const page = params.get("page");
  const limit = params.get("limit");
  return (
    <div className="flex-between">
      <div>
        <Label htmlFor="limit" className="my-2">
          Limit
        </Label>
        <Select
          value={limit as string}
          onValueChange={(v) => router.push(`${pathname}?page=1&limit=${v}`)}
        >
          <SelectTrigger id="limit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {limits.map((limit) => (
                <SelectItem key={limit} value={limit.toString()}>
                  {limit}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-3">
        <Button
          disabled={page == "1"}
          variant="outline"
          onClick={() =>
            router.push(`${pathname}?page=${Number(page) - 1}&limit=${limit}`)
          }
        >
          Previous
        </Button>
        <Button
          disabled={Number(page) == noOfPages}
          variant="outline"
          onClick={() =>
            router.push(`${pathname}?page=${Number(page) + 1}&limit=${limit}`)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};
export default Pagination;
