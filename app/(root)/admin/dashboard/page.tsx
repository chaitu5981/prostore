import Chart from "@/components/admin/dashboard/chart";
import Loader from "@/components/Loader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { currencyFormatter, formatDate, formatDateAndTime } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { toast } from "sonner";

const Dashboard = async () => {
  const res = await getOrderSummary();
  return (
    <div className="wrapper">
      <p className="text-xl font-semibold my-3">Dashboard</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p>Total Revenue</p>
                <p className="font-semibold">
                  {currencyFormatter(
                    res.revenue?._sum.totalPrice?.toString() || 0
                  )}
                </p>
              </div>
              <BadgeDollarSign />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p>Sales</p>
                <p className="font-semibold">{res.sales || 0}</p>
              </div>
              <CreditCard />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p>Customers</p>
                <p className="font-semibold">{res.customers || 0}</p>
              </div>
              <Users />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p>Products</p>
                <p className="font-semibold">{res.products}</p>
              </div>
              <Barcode />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 my-6">
        <Card className="col-span-4">
          <CardContent>
            <p className="font-semibold mb-5 text-lg">Overview</p>

            <Chart data={res.salesByMonth || []} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardContent>
            <p className="font-semibold mb-5 text-lg">Recent Sales</p>
            <Table className="overflow-x-auto ">
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {res.latestSales?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.user.name}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      {currencyFormatter(order.totalPrice.toString())}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
const DashboardPage = () => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <Dashboard />
    </Suspense>
  );
};
export default DashboardPage;
