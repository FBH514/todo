import Input from "./Input.tsx";
import {Endpoints} from "../App.tsx";
import {useQueryClient, useMutation} from "react-query";
import {ChangeEvent} from "react";

async function DELETE(endpoint: string, id: string) {
    await fetch(endpoint, {
        method: "DELETE",
        body: JSON.stringify({id: id}),
    })
}

export default function Todos(props: { newTodo: string , id: string}): JSX.Element {

    const queryCache = useQueryClient();
    const {mutate} = useMutation((todoID: string) => DELETE(Endpoints.DELETE, todoID), {
        onSuccess: () => queryCache.invalidateQueries("todos"),
        onError: (error) => console.error(error)
    })

    async function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            await mutate(props.id);
        }
    }

    return (
        <div className={"rounded-md px-4 py-2 bg-zinc-950 flex items-center justify-between w-full"} id={props.id}>
            <div className={"text-3xl text-center text-zinc-300 font-bold"}>
                {props.newTodo}
            </div>
            <div>
                <Input
                    params={{
                        inputType: "Checkbox",
                        onChange: handleChange
                    }}
                    className={"peer relative appearance-none w-4 h-4 border rounded-sm focus:outline-none bg-zinc-300 checked:bg-zinc-950 checked:border-zinc-950"}
                />
            </div>
        </div>)
}