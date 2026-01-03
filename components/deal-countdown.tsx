"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import Loader from "./Loader";

const TARGET_DATE = new Date("2026-01-13T17:34:00");
const DealCountdown = () => {
  const [time, setTime] = useState<ReturnType<typeof getTimeDifference>>();
  const getTimeDifference = () => {
    const currentTime = new Date();
    const diff = Math.max(Number(TARGET_DATE) - Number(currentTime));
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };
  useEffect(() => {
    setTime(getTimeDifference());
    const timer = setInterval(() => {
      const newTime = getTimeDifference();
      setTime(newTime);
      if (
        newTime.days == 0 &&
        newTime.hours == 0 &&
        newTime.minutes == 0 &&
        newTime.seconds == 0
      )
        clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  if (!time) return <Loader size={100} />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 my-5">
      <div>
        {time?.days <= 0 &&
        time.hours <= 0 &&
        time.minutes <= 0 &&
        time.seconds <= 0 ? (
          <div>
            <p className="text-3xl font-semibold my-4">Deal has ended</p>
            <p>
              {" "}
              This deal is no longer available. Check out our latest promotions!
            </p>
          </div>
        ) : (
          <div>
            <p className="text-3xl font-semibold my-4">Deal of the month</p>
            <p>
              Get ready for a shopping experience like never before with our
              Deals of the Month! Every purchase comes with exclusive perks and
              offers, making this month a celebration of savvy choices and
              amazing deals. Don&apos;t miss out! 🎁🛒
            </p>
            <div className="flex justify-center gap-12 my-4 ">
              <Timer label="Days" value={time?.days} />
              <Timer label="Hours" value={time?.hours} />
              <Timer label="Minutes" value={time?.minutes} />
              <Timer label="Seconds" value={time?.seconds} />
            </div>
          </div>
        )}
        <Button asChild className="mt-5">
          <Link href="/products">View Products</Link>
        </Button>
      </div>
      <div className="flex justify-center w-full">
        <Image
          src="https://wspn723swp.ufs.sh/f/FTxkSQ09RZTfR1WHusFBpy58XUhuZiRq9gxHsLeaKWkbQfYj"
          alt="Image"
          width={300}
          height={100}
          className="object-cover"
        />
      </div>
    </div>
  );
};

const Timer = ({
  label,
  value,
}: {
  label: string;
  value: number | undefined;
}) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-2xl font-semibold">{value}</p>
      <p>{label}</p>
    </div>
  );
};
export default DealCountdown;
