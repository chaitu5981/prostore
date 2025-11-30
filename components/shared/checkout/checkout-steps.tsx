import { checkoutSteps } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CheckoutSteps = ({ current = 1 }: { current?: number }) => {
  return (
    <div className="md:mx-auto flex flex-col md:flex-row gap-4 items-center w-[30%] md:w-[75%] mt-2 mb-4">
      {checkoutSteps.map((step, i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row justify-around gap-4 md:w-[25%] items-center"
        >
          <p
            className={cn(
              "text-xs px-4 py-2 rounded-2xl",
              current == i + 1 ? "bg-gray-300" : ""
            )}
          >
            {step}
          </p>
          {i < 3 && (
            <div className="w-0.5 h-12 md:w-12 md:h-0.5 bg-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
};
export default CheckoutSteps;
