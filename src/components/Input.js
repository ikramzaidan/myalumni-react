import { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
    return (
        <div className={"flex flex-col " + (props.marginBottom ? props.marginBottom : "mb-3")}>
            <label htmlFor={props.name} className={"mb-2 " + props.labelClassName + (props.title ? "" : "hidden")}>{props.title}</label>
            <input
                type={props.type}
                id={props.name}
                name={props.name}
                className={"mb-0.5 " + props.className}
                ref={ref}
                placeholder={props.placeHolder}
                onChange={props.onChange}
                value={props.value}
                disabled={props.readOnly ? true : false}
                autoComplete={props.autoComplete ? props.autoComplete : `off`}
            >
            </input>
            <div className="text-sm text-red-500">{props.errorMsg}</div>
        </div>
    )
});

export default Input;