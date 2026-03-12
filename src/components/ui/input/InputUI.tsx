import * as React from "react";
import Input, { InputProps } from "@mui/joy/Input";
import { useField } from "formik";

type SelectOption = {
    value: string;
    label: string;
};

type FormikInputProps = InputProps & {
    name: string;
    formik?: boolean;
    options?: SelectOption[];
};

const errorStyle: React.CSSProperties = { color: "red", fontSize: 12 };
const selectStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 44,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid rgba(0, 0, 0, 0.23)",
    background: "#fff",
};

const InputUI: React.FC<FormikInputProps> = ({ formik, options, ...props }) => {
    if (formik && props.name) {
        const [field, meta] = useField(props.name);
        const showError = !!meta.error && meta.touched;

        if (props.type === "select") {
            return (
                <>
                    <select
                        {...field}
                        aria-invalid={showError}
                        style={{
                            ...selectStyle,
                            border: showError
                                ? "1px solid #d32f2f"
                                : "1px solid rgba(0, 0, 0, 0.23)",
                            color: field.value ? "#1f2937" : "#6b7280",
                        }}
                    >
                        <option value="">{props.placeholder || "Select an option"}</option>
                        {options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {showError && <div style={errorStyle}>{meta.error}</div>}
                </>
            );
        }

        return (
            <>
                <Input {...field} {...props} error={showError} />
                {showError && <div style={errorStyle}>{meta.error}</div>}
            </>
        );
    }

    if (props.type === "select") {
        return (
            <select name={props.name} defaultValue="" style={selectStyle}>
                <option value="">{props.placeholder || "Select an option"}</option>
                {options?.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    }

    return <Input {...props} />;
};

export default InputUI;
