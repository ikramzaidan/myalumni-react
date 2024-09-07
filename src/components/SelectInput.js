const SelectInput = (props) => {
    return(
        <div className={"flex flex-col " + (props.marginBottom ? props.marginBottom : "mb-3")}>
            <label htmlFor={props.name} className={props.titleClassName ? props.titleClassName : "mb-2"}>{props.title}</label>
            <select
                id={props.name}
                name={props.name}
                className={"mb-0.5 " + props.className}
                onChange={props.onChange}
                defaultValue={props.defaultValue}
            >
                <option value="">{props.placeHolder}</option>
                {props.options.map((option) => {
                    return(
                        <option key={option.value} value={option.value}>{option.label}</option>
                    );
                })}
            </select>
            {props.errorMsg ? (
                <div className="text-sm text-red-500">{props.errorMsg}</div>
            ) : ("")}
        </div>
    );
}

export default SelectInput;