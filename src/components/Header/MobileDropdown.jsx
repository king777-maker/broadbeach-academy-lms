import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const MobileDropdown = ({
    title,
    menuKey,
    items = [],
    mobileDropdown,
    toggleMobileDropdown,
    setMobileMenu,
}) => {

    const isOpen = mobileDropdown === menuKey;

    console.log(`${title} ITEMS:`, items);

    return (
        <div className="border-b border-white/10">

            {/* MAIN CATEGORY */}
            <button
                type="button"
                onClick={() => {
                    toggleMobileDropdown(menuKey);
                }}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    py-3.5
                    text-[#F8D85A]
                    font-semibold
                    text-[15px]
                "
            >
                <span>{title}</span>

                <FaChevronDown
                    className={`
                        text-[11px]
                        transition-transform
                        duration-300
                        ${isOpen ? "rotate-180" : ""}
                    `}
                />
            </button>


            {/* DROPDOWN */}
            {isOpen && (

                <div
                    className="
                        mb-3
                        bg-white
                        rounded-xl
                        shadow-md
                        overflow-hidden
                        py-1
                    "
                >

                    {items.length > 0 ? (

                        items.map((item, index) => {

                            const name =
                                typeof item === "string"
                                    ? item
                                    : item?.name || "Unnamed Course";

                            const path =
                                typeof item === "string"
                                    ? "#"
                                    : item?.path || "#";

                            return (

                                <Link
                                    key={typeof item === "object" ? item.id || index : index}
                                    to={path}
                                    onClick={() => {
                                        setMobileMenu(false);
                                    }}
                                    className="
                                        block
                                        px-4
                                        py-2.5
                                        text-[13.5px]
                                        text-gray-700
                                        font-medium
                                        border-b
                                        border-gray-100
                                        last:border-b-0
                                        hover:bg-slate-50
                                        hover:text-[#102F53]
                                        transition-all
                                        duration-200
                                    "
                                >
                                    {name}
                                </Link>

                            );

                        })

                    ) : (

                        <div
                            className="
                                px-4
                                py-3
                                text-[13px]
                                text-gray-400
                            "
                        >
                            No courses available
                        </div>

                    )}

                </div>

            )}

        </div>
    );
};

export default MobileDropdown;