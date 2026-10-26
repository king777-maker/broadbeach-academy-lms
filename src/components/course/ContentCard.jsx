const ContentCard = ({
    children,
    className = "",
    id = "",
}) => {
    return (
        <div
            id={id}
            className={`
                bg-white
                rounded-2xl
                border
                border-slate-200/80
                shadow-xs
                hover:shadow-sm
                transition-shadow
                duration-200
                p-5
                sm:p-6
                lg:p-7
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export default ContentCard;