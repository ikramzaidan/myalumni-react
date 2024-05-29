const Alert = (props) => {
    return(
        <div className={"p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 " + props.className} role="alert">
            {props.message}
        </div>
    )
}

export default Alert;