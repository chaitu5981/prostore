import { Button } from "@/components/ui/button";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="h-screen flex-center">
      <div className="flex flex-col gap-5 shadow-md items-center p-5 rounded-md ">
        <p className="text-3xl text-red-500">Unauthorized</p>
        <p>You do not have access to this page</p>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </div>
  );
};
export default Unauthorized;
