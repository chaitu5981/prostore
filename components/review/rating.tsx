import { STAR_COLOR } from "@/lib/constants";
import { Star } from "lucide-react";

const Rating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((r) => (
        <Star
          size={18}
          key={r}
          fill={r <= Math.round(rating) ? STAR_COLOR : "white"}
          stroke={STAR_COLOR}
        />
      ))}
    </div>
  );
};
export default Rating;
