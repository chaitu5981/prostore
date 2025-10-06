import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex-center h-screen">
      <div className="shadow py-5 px-10 rounded-md flex-center flex-col gap-5">
        <Image src="/images/logo.svg" alt="logo" width={50} height={50} />
        <h1 className="h2-bold">Page Not Found</h1>
        <p className="text-destructive text-sm">
          The page you are looking for does not exist.
        </p>
        <Button variant={"outline"}>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
};
export default NotFound;
