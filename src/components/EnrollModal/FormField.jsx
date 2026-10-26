const FormField = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    className = "",
    labelClassName = "",
    wrapperClassName = "",
    required = false,
    disabled = false,
    ...rest
}) => {

    return (
        <div className={wrapperClassName}>

            {/* LABEL */}
            {label && (
                <label
                    htmlFor={name}
                    className={labelClassName}
                >
                    {label}

                    {required && (
                        <span className="text-red-500 ml-1">
                            *
                        </span>
                    )}
                </label>
            )}


            {/* INPUT */}
            <input
                id={name}
                type={type}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
                required={required}
                disabled={disabled}
                {...rest}
            />

        </div>
    );
};

export default FormField;