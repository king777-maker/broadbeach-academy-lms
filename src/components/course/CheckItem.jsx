import {
    CheckCircle2,
} from "lucide-react";

const CheckItem = ({
    text,
}) => {

    if (!text) return null;

    return (
        <div
            className="
                flex
                items-start
                gap-3

                bg-[#F8FAFD]

                border
                border-gray-100

                rounded-xl

                p-4
            "
        >
            <CheckCircle2
                size={19}
                className="
                    shrink-0
                    mt-0.5
                    text-[#0B315B]
                "
            />

            <span
                className="
                    text-gray-700

                    text-sm
                    leading-6
                "
            >
                {text}
            </span>
        </div>
    );
};

export default CheckItem;