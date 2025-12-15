import Loader from "@/components/Loader";
import Pagination from "@/components/orders/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order.actions";
import { currencyFormatter, formatDateAndTime, shortenId } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

const OrdersContent = async ({
  page,
  limit,
}: {
  page: string;
  limit: string;
}) => {
  const res = await getMyOrders({
    page: Number(page) || 1,
    limit: Number(limit) || 3,
  });
  if (!res.success) throw new Error(res.message);
  return (
    <div className="wrapper">
      <p className="text-xl font-semibold mb-3">Orders</p>
      <Table className="overflow-x-auto ">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>DATE</TableHead>
            <TableHead>TOTAL</TableHead>
            <TableHead>PAID</TableHead>
            <TableHead>DELIVERED</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.data?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{shortenId(order.id)}</TableCell>
              <TableCell>{formatDateAndTime(order.createdAt)}</TableCell>
              <TableCell>
                {currencyFormatter(order.totalPrice.toString())}
              </TableCell>
              <TableCell>
                {order.isPaid && order.paidAt
                  ? formatDateAndTime(order.paidAt)
                  : "Not Paid"}
              </TableCell>
              <TableCell>
                {order.isDelivered && order.deliveredAt
                  ? formatDateAndTime(order.deliveredAt)
                  : "Not Delivered"}
              </TableCell>
              <TableCell>
                <Link
                  href={`/order/${order.id}`}
                  className="underline text-blue-400"
                >
                  Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination noOfPages={res.noOfPages as number} />
    </div>
  );
};
const OrdersPage = async (props: {
  searchParams: Promise<{ page: string; limit: string }>;
}) => {
  const { page, limit } = await props.searchParams;
  return (
    <Suspense fallback={<Loader size={50} />}>
      <OrdersContent page={page} limit={limit} />
    </Suspense>
  );
};
export default OrdersPage;
