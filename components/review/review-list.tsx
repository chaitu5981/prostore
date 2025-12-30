import { Review } from "@/types";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar, User } from "lucide-react";
import Rating from "./rating";
import { formatDateAndTime } from "@/lib/utils";

const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  return (
    <div className="mt-5 space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <CardTitle>{review.title}</CardTitle>
            <CardDescription>{review.description}</CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Rating rating={Number(review.rating)} />
            <div className="flex gap-1 text-gray-400 items-center">
              <User size={14} />
              <p className="text-sm">{review.user?.name}</p>
            </div>
            <div className="flex gap-1 text-gray-400 items-center">
              <Calendar size={14} />
              <p className="text-sm">{formatDateAndTime(review.createdAt)}</p>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
export default ReviewList;
