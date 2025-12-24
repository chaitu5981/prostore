import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortenId } from "@/lib/utils";
import Link from "next/link";
import DeleteAlert from "../delete-alert";
import { deleteOrder } from "@/lib/actions/order.actions";
type DisplayedOrders = {
  id: string;
  date: string;
  buyer: string;
  total: string;
  paid: string;
  delivered: string;
}[];
const OrderTable = ({
  orders,
  type,
}: {
  orders: DisplayedOrders;
  type: string;
}) => {
  return (
    <Table className="overflow-x-auto ">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>DATE</TableHead>
          <TableHead>BUYER</TableHead>
          <TableHead>TOTAL</TableHead>
          <TableHead>PAID</TableHead>
          <TableHead>DELIVERED</TableHead>
          <TableHead>ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{shortenId(order.id)}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>{order.buyer}</TableCell>
            <TableCell>{order.total}</TableCell>
            <TableCell>{order.paid}</TableCell>
            <TableCell>{order.delivered}</TableCell>
            <TableCell>
              <Button asChild variant="outline">
                <Link href={`/order/${order.id}`}>Details</Link>
              </Button>
              {type == "admin" && (
                <DeleteAlert id={order.id} action={deleteOrder} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default OrderTable;
