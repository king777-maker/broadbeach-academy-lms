import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import testimonialData from "./testimonialData";
import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
  return (
    <section className="bg-[#F6F9FF] py-15">

      <div className="max-w-[1500px] mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <span className="w-8 sm:w-12 h-[3px] bg-amber-400 rounded-full"></span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a1e38] tracking-tight">
              Testimonials
            </h2>
            <span className="w-8 sm:w-12 h-[3px] bg-amber-400 rounded-full"></span>
          </div>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Real success stories from learners who transformed their careers with us.
          </p>
        </div>

        {/* Swiper */}

        <Swiper
          modules={[Pagination, Autoplay]}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          spaceBetween={30}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >

          {testimonialData.map((testimonial) => (

            <SwiperSlide
              key={testimonial.id}
              className="pb-16"
            >

              <TestimonialCard
                testimonial={testimonial}
              />

            </SwiperSlide>

          ))}

        </Swiper>

      </div>

    </section>
  );
};

export default Testimonials;