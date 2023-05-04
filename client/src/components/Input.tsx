import {ChangeEvent, RefObject} from "react";

interface InputProps {
    placeholder?: string;
    ref?: RefObject<HTMLInputElement>
    onChange? : (event: ChangeEvent<HTMLInputElement>) => void;
    inputType?: "Text" | "Number" | "Email" | "Password" | "Checkbox";
}

export default function Input(props: {params: InputProps, className?: string, id?: string }): JSX.Element {

    const classes = {
        defined: props.className,
        fallback: "py-2 px-4 rounded-md bg-zinc-300 mix-blend-soft-light text-zinc-950 font-bold outline-none placeholder:text-zinc-950 text-3xl w-full shadow-lg h-full"
    }

    return <input
        type={props.params.inputType ? props.params.inputType : "Text"}
        placeholder={props.params.placeholder}
        ref={props.params.ref}
        className={props.className ? classes.defined : classes.fallback}
    />
}