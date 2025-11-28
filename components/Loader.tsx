import loader from "@/assets/loader.gif";
import Image from "next/image";
const Loader = ({ size = 30 }: { size?: number }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Image src={loader} width={size} height={size} alt="Loading..." />
    </div>
  );
};
export default Loader;
