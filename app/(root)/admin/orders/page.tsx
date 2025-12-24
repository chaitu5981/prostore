import Loader from "@/components/Loader";
import Pagination from "@/components/orders/pagination";
import OrderTable from "@/components/shared/orders/order-table";
import { currencyFormatter, formatDateAndTime } from "@/lib/utils";

import { getAllOrders } from "@/lib/actions/order.actions";
import { Suspense } from "react";

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
      <p className="text-xl font-semibold mb-3">Orders</p>
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
