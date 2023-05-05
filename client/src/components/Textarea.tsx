import {ChangeEvent, RefObject} from "react";

interface TextareaProps {
    value?: string;
    placeholder?: string;
    ref?: RefObject<HTMLTextAreaElement>;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea(props: {params: TextareaProps, className?: string, id?: string}): JSX.Element {

    const classes = {
        defined: props.className,
        fallback: "h-full w-full rounded-md bg-zinc-300 text-zinc-950 font-bold outline-none placeholder:text-zinc-950 text-3xl shadow-lg p-4"
    };

    return <textarea
        id={props.id}
        className={props.className ? classes.defined : classes.fallback}
        placeholder={props.params.placeholder}
        ref={props.params.ref}
        defaultValue={props.params.value}
    />

}