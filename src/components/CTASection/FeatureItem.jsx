const FeatureItem = ({ icon: Icon, text }) => {
  return (
    <div
      className="
      flex
      items-center
      gap-4
      group
      cursor-pointer
      transition-all
      duration-300
      "
    >
      {/* Icon */}

      <div
        className="
        w-8
        h-8
        rounded-full
        bg-[#2168D8]
        flex
        items-center
        justify-center
        shadow-md
        group-hover:scale-110
        transition-all
        duration-300
        "
      >
        <Icon
          size={18}
          className="text-white"
          strokeWidth={3}
        />
      </div>

      {/* Text */}

      <p
        className="
        text-[#374151]
        text-[18px]
        font-semibold
        group-hover:text-[#2168D8]
        transition-all
        duration-300
        "
      >
        {text}
      </p>
    </div>
  );
};

export default FeatureItem;