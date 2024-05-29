const Select = (props) => {
    return(
        <div className="flex flex-col mb-3">
            <label htmlFor={props.name} className="mb-2">{props.title}</label>
            <select
                id={props.name}
                name={props.name}
                className={"mb-0.5 " + props.className}
                onChange={props.onChange}
            >
                <option value="">{props.placeHolder}</option>
                {props.options.map((option) => {
                    return(
                        <option key={option.id} value={option.id} selected={option.selected}>{option.value}</option>
                    );
                })}
            </select>
            <div className="text-sm text-red-500">{props.errorMsg}</div>
        </div>
    );
}

export default Select;