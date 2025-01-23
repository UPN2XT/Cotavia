import { user } from "../Users/components/userCard";

interface useProps {
    user: user;
    remove: boolean;
    func: Function;
    disabled: boolean
}

export default function(props: useProps) {
    return (
        <div className="w-4/6 bg-neutral-800 rounded-lg flex justify-between p-2 items-center">
            <div className="flex items-center gap-4">
                <img src={props.user.pfp} className="w-16 rounded-full"/>
                <div className="flex flex-col">
                    <text className="font-bold text-xl">
                        {props.user.displayname}
                    </text>
                    <text className="text-lg">
                        @{props.user.username}
                    </text>
                </div>
            </div>
            <button className={"pl-3 pr-3 pt-1 pb-1 rounded-xl h-12 " + 
                (props.remove? "bg-red-500": "bg-green-500")
            }
                onClick={() => props.func()} disabled={props.disabled}>
                {props.remove? "Remove": "Add"}
            </button>
        </div>
    )
}