import Loader from "@/components/Loader";
import Pagination from "@/components/orders/pagination";
import DeleteAlert from "@/components/shared/delete-alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllProducts } from "@/lib/actions/products.actions";
import { currencyFormatter, shortenId } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { toast } from "sonner";

const Products = async ({
  searchParams,
}: {
  searchParams: Promise<{ limit: string; page: string }>;
}) => {
  const { page, limit } = await searchParams;
  const res = await getAllProducts({
    limit: Number(limit) || 3,
    page: Number(page) || 1,
  });
  if (!res.success) toast.error(res.message);
  return (
    <div className="wrapper">
      <div className="flex justify-between my-3">
        <p className="text-xl font-semibold">Products</p>
        <Button asChild>
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>
      <Table className="overflow-x-auto ">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.data?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{shortenId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {currencyFormatter(product.price.toString())}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating.toString()}</TableCell>
              <TableCell>
                <Button asChild variant="outline">
                  <Link href={`/admin/products/create`}>Edit</Link>
                </Button>
                {/* <DeleteAlert id={product.id} action={} /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination noOfPages={res.noOfPages as number} />
    </div>
  );
};

const ProductsPage = (props: {
  searchParams: Promise<{ limit: string; page: string }>;
}) => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <Products searchParams={props.searchParams} />
    </Suspense>
  );
};
export default ProductsPage;
