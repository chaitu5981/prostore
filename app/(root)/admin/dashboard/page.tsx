import Loader from "@/components/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { currencyFormatter } from "@/lib/utils";
import { BadgeDollarSign } from "lucide-react";
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
                    res.revenue?._sum.itemsPrice?.toString() || 0
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
              <BadgeDollarSign />
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
              <BadgeDollarSign />
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
              <BadgeDollarSign />
            </div>
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
