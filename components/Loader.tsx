import loader from "@/assets/loader.gif";
import Image from "next/image";
const Loader = ({ size = 30 }: { size?: number }) => {
  return (
    <div>
      <Image src={loader} width={size} height={size} alt="Loading..." />
    </div>
  );
};
export default Loader;
