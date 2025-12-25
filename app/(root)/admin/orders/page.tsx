import Loader from "@/components/Loader";
import Pagination from "@/components/orders/pagination";
import OrderTable from "@/components/shared/orders/order-table";
import { currencyFormatter, formatDateAndTime } from "@/lib/utils";

import { getAllOrders } from "@/lib/actions/order.actions";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AdminOrders = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; limit: string; query: string }>;
}) => {
  const { page, limit, query } = await searchParams;

  const res = await getAllOrders({
    page: Number(page) || 1,
    limit: Number(limit) || 3,
    query: query || "",
  });
  if (!res.success) throw new Error(res.message);
  const displayedOrders = res.data?.map((order) => ({
    id: order.id,
    date: formatDateAndTime(order.createdAt),
    buyer: order.user.name,
    total: currencyFormatter(order.totalPrice.toString()),
    paid:
      order.isPaid && order.paidAt
        ? formatDateAndTime(order.paidAt)
        : "Not Paid",
    delivered:
      order.isDelivered && order.deliveredAt
        ? formatDateAndTime(order.deliveredAt)
        : "Not Delivered",
  }));
  return (
    <div className="wrapper">
      <div className="flex gap-4 items-center">
        <p className="text-xl font-semibold mb-3">Orders</p>
        {query && (
          <span className="flex gap-2 items-center">
            <p>Filtered by {`"${query}"`}</p>
            <Link href="/admin/orders">
              <Button variant="outline">Remove Filter</Button>
            </Link>
          </span>
        )}
      </div>
      {!displayedOrders || displayedOrders.length == 0 ? (
        <p className="text-center font-semibold">No Orders</p>
      ) : (
        <div>
          <OrderTable orders={displayedOrders} type="admin" />
          <Pagination noOfPages={res.noOfPages as number} />
        </div>
      )}
    </div>
  );
};
const AdminOrdersPage = ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; limit: string; query: string }>;
}) => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <AdminOrders searchParams={searchParams} />
    </Suspense>
  );
};
export default AdminOrdersPage;
