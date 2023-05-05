import {useMutation, useQuery, useQueryClient} from "react-query";
import Todos from "./components/Todos.tsx";
import Input from "./components/Input.tsx";
import {useEffect, useRef, useState} from "react";
import Button from "./components/Button.tsx";
import Socials from "./components/Socials.tsx";

interface SightingProps {
    id: number;
    sighting: string;
}

enum Endpoints {
    SIGHTINGS = "http://localhost:8000/sightings",
    CREATE = "http://localhost:8000/sightings/add"
}

async function GET(endpoint: string): Promise<any> {
    const response = await fetch(endpoint);
    return await response.json();
}

const POST_BODY = (newData: any) => {
    return {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({sighting: newData})
    }
}

async function POST(endpoint: string, newData: any): Promise<any> {
    const response = await fetch(endpoint, POST_BODY(newData));
    const {sighting} = await response.json();
    return sighting;
}

function getDate(): { month: string, day: number, year: number } {
    const date = new Date();
    const month = date.toLocaleString("default", {month: "long"});
    const day = date.getDate();
    const year = date.getFullYear();
    return {month, day, year};
}

function App(): JSX.Element {

    const queryCache = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [textboxValue, setTextboxValue] = useState("");
    const {data: sightings, error} = useQuery<SightingProps[]>("sightings", () => GET(Endpoints.SIGHTINGS));
    const date = getDate();

    useEffect(() => {
        function handler(e: KeyboardEvent) {
            if (e.key === "Enter") {
                handleSubmit()
            }
        }

        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    });

    useEffect(() => {
        if (textareaRef?.current) {
            textareaRef.current.focus();
        }
    })

    useEffect(() => {
        const stored = window.localStorage.getItem("sightings");
        if (stored) {
            setTextboxValue(stored);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("sightings", textboxValue);
    }, [textboxValue]);

    const {mutate} = useMutation((newData: any) => POST(Endpoints.CREATE, newData), {
        onSuccess: () => queryCache.invalidateQueries("sightings"),
        onError: (error) => console.error(error)
    });

    if (error) return <span>Error Loading data</span>;
    if (!sightings) return <span>Loading...</span>;

    function handleSubmit(): void {
        mutate(inputRef.current?.value);
        if (inputRef?.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <div
            className={"bg-gradient-to-br from-yellow-300 via-rose-500 to-sky-800 text-zinc-50 h-screen grid grid-rows-3 gap-4 p-8 App"}
            style={{gridTemplateRows: "fit-content(100%) fit-content(100%) 1fr"}}
        >
            <Socials/>
            <div
                className={"grid grid-cols-3 w-full gap-4"}
                style={{gridTemplateColumns: "1fr 3fr 1fr"}}>
                <div className={"flex items-center gap-4 text-6xl w-full mix-blend-overlay"}>
                    <div>{date.month}</div>
                    <div>{date.day},</div>
                    <div>{date.year}</div>
                </div>
                <Input params={{placeholder: "Enter a todo", ref: inputRef}}/>
                <Button params={{value: "Add", onClick: handleSubmit}}/>
            </div>
            <div className={"grid grid-cols-2 h-full w-full gap-4 overflow-hidden"}
                 style={{gridTemplateColumns: "1fr 1fr"}}>
                <div
                    className={"h-full w-full flex flex-col gap-4 items-start overflow-y-scroll bg-zinc-300 mix-blend-overlay rounded-md p-4"}>
                    {sightings.map((item) => (
                        <Todos newTodo={item.sighting} key={item.id}/>
                    ))}
                </div>
                <div className={"h-full w-full"}>
                    <textarea
                        className={"h-full w-full rounded-md bg-zinc-300 text-zinc-950 font-bold outline-none placeholder:text-zinc-950 text-3xl shadow-lg p-4 resize-none mix-blend-overlay"}
                        onChange={(e) => setTextboxValue(e.target.value)}
                        defaultValue={textboxValue}
                        placeholder={"Enter notes"}
                    />
                </div>
            </div>
        </div>
    )
}

export default App;