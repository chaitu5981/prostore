"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-6 ">
      <Image
        src={images[current]}
        width={350}
        height={400}
        alt="Product Image"
        className="object-cover"
      />
      <div className="flex gap-4">
        {images.map((image, i) => (
          <Image
            onClick={() => setCurrent(i)}
            src={image}
            width={75}
            height={75}
            alt="Image"
            key={i}
            className={cn(
              "border-2",
              "object-contain",
              "border-gray-200",
              "hover:border-orange-500",
              current == i && "border-orange-500"
            )}
          />
        ))}
      </div>
    </div>
  );
};
export default ProductImages;
