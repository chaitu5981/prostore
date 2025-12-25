"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import autoPlay from "embla-carousel-autoplay";
const BannerCarousel = ({ data }: { data: Product[] }) => {
  return (
    <Carousel
      className="w-full"
      opts={{ loop: true }}
      plugins={[
        autoPlay({
          delay: 2000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product) => (
          <CarouselItem key={product.id}>
            <div className="p-1">
              <Link href={`/product/${product.slug}`}>
                <Image
                  src={product.banner!}
                  alt={product.name}
                  height={800}
                  width={1200}
                  className="w-full h-100"
                />
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
export default BannerCarousel;
