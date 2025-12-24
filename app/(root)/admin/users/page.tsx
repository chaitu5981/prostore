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
import { deleteProduct, getAllProducts } from "@/lib/actions/products.actions";
import { deleteUser, getAllUsers } from "@/lib/actions/user.actions";
import { currencyFormatter, shortenId } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { toast } from "sonner";

const AdminUsers = async ({
  searchParams,
}: {
  searchParams: Promise<{ limit: string; page: string; query: string }>;
}) => {
  const { page, limit, query } = await searchParams;
  const res = await getAllUsers({
    limit: Number(limit) || 3,
    page: Number(page) || 1,
    query: query || "",
  });
  if (!res.success) toast.error(res.message);
  return (
    <div className="wrapper">
      <p className="text-xl font-semibold">Users</p>
      <Table className="overflow-x-auto ">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!res.data || res?.data.length == 0 ? (
            <p>No Products found</p>
          ) : (
            res.data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{shortenId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>

                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button asChild variant="outline">
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteAlert id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination noOfPages={res.noOfPages as number} />
    </div>
  );
};

const AdminUsersPage = (props: {
  searchParams: Promise<{ limit: string; page: string; query: string }>;
}) => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <AdminUsers searchParams={props.searchParams} />
    </Suspense>
  );
};
export default AdminUsersPage;
