"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    image: "/slider/banner-1.jpg",
    alt: "A welcoming collection of books",
    eyebrow: "Find your next chapter",
    title: "Stories worth getting lost in.",
    description: "Explore a thoughtfully chosen collection for every kind of curious reader.",
  },
  {
    image: "/slider/banner-2.jpg",
    alt: "A quiet place to slow down and read",
    eyebrow: "Make room for wonder",
    title: "Your next favorite is waiting.",
    description: "Discover new voices, timeless classics, and books to share.",
  },
  {
    image: "/slider/banner-3.jpg",
    alt: "Books selected for readers and storytellers",
    eyebrow: "Hand-picked for you",
    title: "Bring a little more story home.",
    description: "Find beautiful editions and thoughtful reads for your shelves.",
  },
  {
    image: "/slider/banner-4.jpg",
    alt: "A stack of books ready to be discovered",
    eyebrow: "Open a new world",
    title: "There is always another story.",
    description: "Browse the shelf and meet the book you did not know you needed.",
  },
];

export default function HeroSlider() {
  return (
    <section
      aria-label="Featured books"
      className="hero-slider relative isolate h-[min(76svh,48rem)] min-h-[29rem] overflow-hidden bg-[#164B36] sm:min-h-[34rem]"
    >
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        loop
        speed={850}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.image} className="relative h-full">
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              quality={80}
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#102f24]/85 via-[#102f24]/50 to-[#102f24]/10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f24]/45 via-transparent to-[#102f24]/10" />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-6 pb-12 pt-8 sm:px-10 lg:px-8">
              <div className="max-w-2xl text-[#F8F5EC]">
                <p className="mb-4 inline-flex rounded-full border border-[#F8F5EC]/35 bg-[#F8F5EC]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#F8F5EC] shadow-lg backdrop-blur-xl sm:text-sm">
                  {slide.eyebrow}
                </p>
                <h1 className="max-w-xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-balance drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-[#F8F5EC]/90 drop-shadow sm:text-lg">
                  {slide.description}
                </p>
                <Link
                  href="/books"
                  className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#F39A32] px-6 py-3 text-sm font-semibold text-[#164B36] shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#ffad4c] hover:shadow-xl active:scale-95"
                >
                  Explore the collection
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
