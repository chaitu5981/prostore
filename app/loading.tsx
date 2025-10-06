import Image from "next/image";
import loader from "@/assets/loader.gif";
const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Image src={loader} alt="Loading..." width={120} height={120} />
    </div>
  );
};
export default Loading;
