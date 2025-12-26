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
import { useTransition } from "react";
import Loader from "../Loader";

const Pagination = ({ noOfPages }: { noOfPages: number }) => {
  const limits = [3, 5, 10, 20];
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const page = params.get("page");
  const limit = params.get("limit");
  // const query = params.get("query");
  const [goingToNextPage, startGoingToNextPage] = useTransition();
  const [goingToPreviousPage, startGoingToPreviousPage] = useTransition();
  const [changingLimit, startChangingLimit] = useTransition();
  let newParams = Object.fromEntries(params.entries());
  const goToNextPage = () =>
    startGoingToNextPage(() => {
      newParams = { ...newParams, page: (Number(page || 1) + 1).toString() };
      router.push(`${pathname}?${new URLSearchParams(newParams).toString()}`);
    });
  const goToPreviousPage = () =>
    startGoingToPreviousPage(() => {
      newParams = { ...newParams, page: (Number(page) - 1).toString() };
      router.push(`${pathname}?${new URLSearchParams(newParams).toString()}`);
    });
  const changeLimit = (v: string) =>
    startChangingLimit(() => {
      newParams = { ...newParams, limit: v };
      router.push(`${pathname}?${new URLSearchParams(newParams).toString()}`);
    });
  return (
    <div className="flex-between">
      <div>
        <Label htmlFor="limit" className="my-2">
          Limit
        </Label>
        <Select value={limit || "3"} onValueChange={(v) => changeLimit(v)}>
          <SelectTrigger id="limit">
            {changingLimit ? <Loader size={20} /> : <SelectValue />}
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
      {noOfPages > 1 && (
        <div className="flex gap-3">
          <Button
            disabled={page == "1"}
            variant="outline"
            onClick={goToPreviousPage}
          >
            {goingToPreviousPage ? <Loader size={20} /> : "Previous"}
          </Button>
          <Button
            disabled={Number(page) == noOfPages}
            variant="outline"
            onClick={goToNextPage}
          >
            {goingToNextPage ? <Loader size={20} /> : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
};
export default Pagination;
