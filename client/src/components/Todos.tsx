import Input from "./Input.tsx";

export default function Todos(props: { newTodo: string }): JSX.Element {

    return (
        <div className={"rounded-md px-4 py-2 bg-zinc-800 flex items-center justify-between w-full"}>
            <div className={"text-3xl text-center text-zinc-300 font-bold"}>
                {props.newTodo}
            </div>
            <div>
                <Input params={{inputType: "Checkbox"}}
                       className={"peer relative appearance-none w-4 h-4 border rounded-md focus:outline-none bg-zinc-950"}
                />
            </div>
        </div>)
}