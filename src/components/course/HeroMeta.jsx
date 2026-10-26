const HeroMeta = ({
    icon: Icon,
    label,
    value,
}) => {

    if (!value) return null;

    return (
        <div
            className="
                flex
                items-center
                gap-3
            "
        >
            <div
                className="
                    w-10
                    h-10
                    shrink-0

                    rounded-lg

                    bg-white/10

                    flex
                    items-center
                    justify-center

                    text-[#FFDB58]
                "
            >
                <Icon size={19} />
            </div>

            <div>
                <div
                    className="
                        text-white/50

                        text-[11px]

                        uppercase
                        tracking-wide
                    "
                >
                    {label}
                </div>

                <div
                    className="
                        text-white

                        text-sm
                        font-semibold
                    "
                >
                    {value}
                </div>
            </div>
        </div>
    );
};

export default HeroMeta;