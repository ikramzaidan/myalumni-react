const TextArea = (props) => {
    return (
        <div className="flex flex-col mb-3">
            <label htmlFor="{props.name}" className="mb-2">{props.title}</label>
            <textarea
                id={props.name}
                placeholder={props.placeHolder}
                name={props.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-0.5"
                rows={props.rows ? props.rows : "3"}
                value={props.value}
                onChange={props.onChange}
            >
            </textarea>
            <div className="text-sm text-red-500">{props.errorMsg}</div>
        </div>
    )
}

export default TextArea;