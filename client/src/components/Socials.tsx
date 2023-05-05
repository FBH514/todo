interface SocialProps {
    name: string;
    link: string;
    icon: string;
}

const SIZE = 48;
const COLOR = "d4d4d8";
// const COLOR = "3f3f46";

const data: SocialProps[] = [
    {
        name: "Portfolio",
        link: "https://fbhworks.me",
        icon: `https://img.icons8.com/ios/${SIZE}/${COLOR}/source-code.png`
    },
    {
        name: "Github",
        link: "https://github.com/fbh514",
        icon: `https://img.icons8.com/glyph-neue/${SIZE}/${COLOR}/github.png`
    },
    {
        name: "LinkedIn",
        link: "https://linkedin.com/in/fhandfield",
        icon: `https://img.icons8.com/glyph-neue/${SIZE}/${COLOR}/linkedin.png`
    }
]

export default function Socials(): JSX.Element {

    return (
        <div className={"flex items-center justify-center gap-4 mix-blend-overlay"}>
            {data.map((item) => (
                <a href={item.link} className={"hover:-translate-y-2"} key={item.name}>
                    <img src={item.icon} alt={item.name} key={item.name}/>
                </a>
            ))}
        </div>
    )
}