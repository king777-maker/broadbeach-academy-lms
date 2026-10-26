const ImageCard = ({
    src,
    alt,
    className = "",
    contain = false,
}) => {

    return (

        <div
            className={`
                bg-white
                p-[5px]
                shadow-[0_2px_14px_rgba(0,0,0,0.15)]
                ${className}
            `}
        >

            <img
                src={src}
                alt={alt}
                className={`
                    w-full
                    h-full

                    ${
                        contain
                            ? "object-contain"
                            : "object-cover"
                    }
                `}
            />

        </div>

    );
};


export default ImageCard;