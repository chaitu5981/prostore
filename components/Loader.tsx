import loader from "@/assets/loader.gif";
import Image from "next/image";
const Loader = () => {
  return (
    <div>
      <Image src={loader} width={30} height={30} alt="Loading..." />
    </div>
  );
};
export default Loader;
