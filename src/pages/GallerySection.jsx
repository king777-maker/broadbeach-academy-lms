const GallerySection = ({
    title,
    description,
    paragraph,
    images,
}) => {

    return (

        <section>

            <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                <div className="py-10 border-b border-gray-300">

                   

                    <p
                        className="
                            max-w-[1250px]
                            mx-auto

                            mt-5

                            text-center

                            text-[#0062A8]

                            text-[18px]
                            md:text-[20px]

                            leading-[1.55]
                        "
                    >
                        {description}
                    </p>


                    <p
                        className="
                            max-w-[1250px]
                            mx-auto

                            mt-4

                            text-center

                            text-[16px]
                            md:text-[17px]

                            leading-[1.8]
                        "
                    >
                        {paragraph}
                    </p>


                    <div
                        className="
                            grid
                            sm:grid-cols-2
                            lg:grid-cols-4

                            gap-4

                            mt-10
                        "
                    >

                       
                    </div>


                  
                </div>

            </div>

        </section>

    );
};
export default GallerySection;