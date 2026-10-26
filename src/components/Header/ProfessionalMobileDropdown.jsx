import {
    FaChevronDown,
    FaChevronRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";

// import {
//     professionalCertificationMenu,
// } from "../../data/headerMenuData";

const ProfessionalMobileDropdown = ({
    title = "Professional Certifications",
    menuKey = "professional",
    subcategories = [],
    mobileDropdown,
    toggleMobileDropdown,
    mobileProfessionalCategory,
    toggleProfessionalCategory,
    setMobileMenu,
    setMobileProfessionalCategory,
}) => {

    const isOpen = mobileDropdown === menuKey;

    return (
        <div className="border-b border-white/10">

            <button
                type="button"
                onClick={() =>
                    toggleMobileDropdown(menuKey)
                }
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


            {isOpen && (

                <div
                    className="
                        mb-3
                        bg-white
                        rounded-xl
                        shadow-md
                        overflow-hidden
                    "
                >

                    {subcategories.map(
                        (category, categoryIndex) => {

                            const catId = category.id || category.title || category.name || categoryIndex;
                            const catName = category.name || category.title || "Category";
                            const items = category.items || [];
                            const categoryOpen = mobileProfessionalCategory === catId;

                            return (

                                <div
                                    key={catId}
                                    className="
                                        border-b
                                        border-gray-100
                                        last:border-b-0
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleProfessionalCategory(catId)
                                        }
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            justify-between
                                            gap-3

                                            px-4
                                            py-3

                                            text-left
                                            text-[#102F53]
                                            text-[14px]
                                            font-semibold

                                            hover:bg-slate-50
                                            transition
                                        "
                                    >
                                        <span>{catName}</span>

                                        <FaChevronRight
                                            className={`
                                                flex-shrink-0
                                                text-[10px]
                                                transition-transform
                                                duration-200

                                                ${
                                                    categoryOpen
                                                        ? "rotate-90 text-[#F8D85A]"
                                                        : "text-gray-400"
                                                }
                                            `}
                                        />
                                    </button>


                                    {categoryOpen && (

                                        <div
                                            className="
                                                bg-slate-50
                                                border-t
                                                border-gray-100
                                            "
                                        >

                                            {items.map(
                                                (item, index) => {
                                                    const itemName = typeof item === "string" ? item : item.name;
                                                    const itemPath = typeof item === "string" ? "#" : (item.path || "#");

                                                    return (
                                                        <Link
                                                            key={`${catId}-${index}`}
                                                            to={itemPath}
                                                            onClick={() => {
                                                                setMobileMenu(false);
                                                                if (setMobileProfessionalCategory) {
                                                                    setMobileProfessionalCategory(null);
                                                                }
                                                            }}
                                                            className="
                                                                block
                                                                pl-7
                                                                pr-4
                                                                py-2.5

                                                                text-[13px]
                                                                leading-[1.45]

                                                                text-gray-700
                                                                font-medium

                                                                border-b
                                                                border-gray-100/70
                                                                last:border-b-0

                                                                hover:bg-white
                                                                hover:text-[#102F53]

                                                                transition
                                                            "
                                                        >
                                                            {itemName}
                                                        </Link>
                                                    );
                                                }
                                            )}

                                        </div>
                                    )}

                                </div>
                            );
                        }
                    )}

                </div>
            )}

        </div>
    );
};

export default ProfessionalMobileDropdown;