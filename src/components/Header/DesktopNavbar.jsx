import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getHeaderMenu,
    getProfessionalCertificationMenu
} from "../../api/api";

import DesktopDropdown from "./DesktopDropdown";
import ProfessionalDesktopDropdown from "./ProfessionalDesktopDropdown";

const DesktopNavbar = () => {

    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);


    // =====================================================
    // FETCH BOTH MENUS
    // =====================================================

    useEffect(() => {

        const fetchMenus = async () => {

            try {

                // =================================================
                // 1. HEADER MENU API
                // =================================================

                const headerResponse =
                    await getHeaderMenu();

                console.log(
                    "HEADER MENU RESPONSE:",
                    headerResponse?.data
                );


                let headerMenu = [];

                if (
                    headerResponse?.data?.success &&
                    Array.isArray(
                        headerResponse?.data?.data
                    )
                ) {

                    headerMenu =
                        headerResponse.data.data;

                }


                // =================================================
                // 2. PROFESSIONAL CERTIFICATIONS API
                // =================================================

                const professionalResponse =
                    await getProfessionalCertificationMenu();

                console.log(
                    "PROFESSIONAL MENU RESPONSE:",
                    professionalResponse
                );


                let professionalData = null;

                if (
                    professionalResponse?.success &&
                    professionalResponse?.data
                ) {

                    professionalData =
                        professionalResponse.data;

                }


                // -----------------------------------------
                // Extract Lean Six Sigma if present at top level
                // -----------------------------------------
                const leanSixSigmaCategory = headerMenu.find(
                    (cat) =>
                        cat.slug === "lean-six-sigma" ||
                        cat.name?.toLowerCase().includes("lean six sigma")
                );

                const filteredHeaderMenu = headerMenu.filter(
                    (cat) =>
                        cat.slug !== "lean-six-sigma" &&
                        !cat.name?.toLowerCase().includes("lean six sigma")
                );

                const mergedMenu = filteredHeaderMenu.map((category) => {

                    // -----------------------------------------
                    // Professional Certifications
                    // -----------------------------------------

                    if (
                        category.slug === "professional-certifications"
                    ) {

                        let subcategories = Array.isArray(
                            professionalData?.subcategories
                        )
                            ? [...professionalData.subcategories]
                            : [];

                        const exists = subcategories.some(
                            (sub) =>
                                sub.slug === "lean-six-sigma" ||
                                sub.name?.toLowerCase().includes("lean six sigma")
                        );

                        if (!exists) {
                            if (leanSixSigmaCategory) {
                                subcategories.push({
                                    id: leanSixSigmaCategory.id || "lean-six-sigma-sub",
                                    name: leanSixSigmaCategory.name || "Lean Six Sigma",
                                    slug: leanSixSigmaCategory.slug || "lean-six-sigma",
                                    items: leanSixSigmaCategory.items || []
                                });
                            } else {
                                subcategories.push({
                                    id: "lean-six-sigma-sub",
                                    name: "Lean Six Sigma",
                                    slug: "lean-six-sigma",
                                    items: [
                                        { id: "lss-1", name: "Lean Six Sigma Yellow Belt", path: "/course?category=lean-six-sigma" },
                                        { id: "lss-2", name: "Lean Six Sigma Green Belt", path: "/course?category=lean-six-sigma" },
                                        { id: "lss-3", name: "Lean Six Sigma Black Belt", path: "/course?category=lean-six-sigma" },
                                    ]
                                });
                            }
                        }

                        return {
                            ...category,
                            subcategories,
                            items: []
                        };

                    }

                    return category;

                });


                console.log(
                    "MERGED HEADER MENU:",
                    mergedMenu
                );


                setMenu(
                    mergedMenu
                );


            } catch (error) {

                console.error(
                    "HEADER MENU ERROR:",
                    error?.response?.data ||
                    error
                );

                setMenu([]);

            } finally {

                setLoading(false);

            }

        };


        fetchMenus();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <nav className="hidden xl:flex flex-1 items-center justify-center">
                <span className="text-[#F8D85A] text-sm font-medium animate-pulse">
                    Loading menu...
                </span>
            </nav>
        );
    }

    return (
        <nav className="hidden xl:flex flex-1 items-center justify-center gap-6 2xl:gap-8 px-4">
            {menu
                .filter((category) => category.slug !== "about-us" && category.name?.toLowerCase() !== "about us")
                .map((category) => {
                if (category.slug === "professional-certifications") {
                    return (
                        <ProfessionalDesktopDropdown
                            key={category.id}
                            title={category.name}
                            subcategories={
                                Array.isArray(category.subcategories)
                                    ? category.subcategories
                                    : []
                            }
                        />
                    );
                }

                return (
                    <DesktopDropdown
                        key={category.id}
                        title={category.name}
                        categorySlug={category.slug}
                        items={
                            Array.isArray(category.items)
                                ? category.items
                                : []
                        }
                        width={
                            category.slug === "about-us"
                                ? "w-[280px]"
                                : "w-[400px]"
                        }
                    />
                );
            })}
        </nav>
    );
};

export default DesktopNavbar;