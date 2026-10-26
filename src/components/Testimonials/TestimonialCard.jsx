import { Star, Quote } from "lucide-react";

const TestimonialCard = ({ testimonial }) => {
  return (
    <div
      className="
      relative
      bg-white
      rounded-[24px]
      shadow-lg
      p-8
      hover:shadow-2xl
      hover:-translate-y-2
      transition-all
      duration-300
      h-full
      "
    >
      {/* Quote Icon */}

      <div
        className="
        absolute
        top-6
        left-6
        text-[#D9E8FF]
        "
      >
        <Quote
          size={20}
          fill="currentColor"
          strokeWidth={1.5}
        />
      </div>

      {/* Rating */}

      <div className="flex gap-1 mt-8 mb-6">

        {[...Array(5)].map((_, index) => (

          <Star
            key={index}
            size={15}
            fill={index < testimonial.rating ? "#FDBA12" : "none"}
            color="#FDBA12"
          />

        ))}

      </div>

      {/* Review */}

      <p
        className="
        text-[#6B7280]
        text-[15px]
        leading-8
        min-h-[110px]
        italic
        "
      >
        {testimonial.review}
      </p>

      {/* User */}

      <div className="flex items-center mt-8">

        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="
          w-14
          h-14
          rounded-full
          object-cover
          border-4
          border-[#EDF4FF]
          "
        />

        <div className="ml-4">

          <h4
            className="
            text-[#1D3557]
            font-bold
            text-[17px]
            "
          >
            {testimonial.name}
          </h4>

          <p
            className="
            text-[#7C8799]
            text-sm
            mt-1
            "
          >
            {testimonial.designation}
          </p>

        </div>

      </div>
    </div>
  );
};

export default TestimonialCard;