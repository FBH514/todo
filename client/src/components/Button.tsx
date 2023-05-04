interface ButtonProps {
    onClick?: () => void;
    buttonType?: "button" | "submit" | "reset";
    value?: string;
    disabled?: boolean;
    icon?: string;
}

export default function Button(props: { params: ButtonProps, className?: string, id?: string }): JSX.Element {

    const classes = {
        defined: props.className,
        fallback: "rounded-md px-4 py-2 bg-sky-800 text-zinc-300 text-3xl shadow-lg hover:bg-zinc-400 hover:text-zinc-900 transition duration-500 ease-in-out"
    }

    return <button
        type="submit"
        onClick={props.params.onClick}
        className={props.className ? classes.defined : classes.fallback}
        id={props.id}
        disabled={props.params.disabled}
    >
        {props.params.value}
        {props.params.icon}
    </button>
}