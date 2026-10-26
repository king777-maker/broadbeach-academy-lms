import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

const features = [
  "Flexible learning options and schedules",
  "Industry-experienced instructors",
  "Interactive and engaging course content",
  "Career guidance and placement support",
  "State-of-the-art online learning platform",
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-[1400px] mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ================= Images ================= */}

          <div>

            {/* Top Images */}

            <div className="grid grid-cols-2 gap-5 mb-5">

              <img
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900"
                alt=""
                className="w-full h-[230px] rounded-[22px] object-cover"
              />

              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900"
                alt=""
                className="w-full h-[230px] rounded-[22px] object-cover"
              />

            </div>

            {/* Bottom Image */}

            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200"
              alt=""
              className="w-full h-[520px] rounded-[22px] object-cover"
            />

          </div>

          {/* ================= Content ================= */}

          <div>

            <span className="uppercase tracking-[2px] text-[#2563EB] font-bold text-lg">
              Why Choose Us
            </span>

            <h2 className="mt-6 text-[48px] leading-[60px] font-bold text-[#1E3A66]">
              Transforming Education for a Better Tomorrow
            </h2>

            <p className="mt-8 text-[20px] leading-10 text-[#667085]">
              Broadbeach Online Academy provides internationally
              recognized certification courses designed by industry
              experts to help professionals accelerate their careers.
            </p>

            {/* Features */}

            <div className="mt-12 space-y-8">

              {features.map((item, index) => (

                <div
                  key={index}
                  className="flex items-center gap-5"
                >

                  <FaCheckCircle className="text-[#2563EB] text-3xl shrink-0" />

                  <span className="text-[24px] font-semibold text-[#1E3A66]">
                    {item}
                  </span>

                </div>

              ))}

            </div>

            {/* Button */}

            <button
              className="
                mt-14
                bg-[#2563EB]
                hover:bg-[#1E3A66]
                transition
                text-white
                rounded-full
                px-10
                py-5
                text-xl
                font-semibold
                flex
                items-center
                gap-4
              "
            >
              Discover More

              <FaArrowRight />
            </button>

          </div>

        </div>

      </div>

    </section>
  );
};

export default WhyChooseUs;