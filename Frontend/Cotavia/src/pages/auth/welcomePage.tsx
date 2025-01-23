import { Link, Outlet } from "react-router"
import { UserCircleIcon, UserPlusIcon } from "@heroicons/react/16/solid"
import { useState } from "react"

const linkCkass = "w-full bg-black bg-opacity-25 backdrop-blur-md p-4 rounded-md flex gap-4 items-center"
export default function() {
    const [stage, setStage] = useState<number>(0)
    const nextStage = () => setStage(1)

    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-96 bg-neutral-800 rounded-lg p-6 ">
                {stage == 0? (
                    <>
                        <h2 className="text-4xl font-semibold">
                            Welcome
                        </h2>
                        <div className="flex flex-col p-4 mt-4 gap-4">
                            <p className="mb-4 text-xl">
                                Do you already have an account?
                            </p>
                            <Link to="login" className={linkCkass} onClick={nextStage}>
                                <UserCircleIcon className="size-8"/> Yes, I have an account
                            </Link>
                            <Link to="signup" className={linkCkass} onClick={nextStage}>
                                <UserPlusIcon className="size-8"/> No, Create a new account
                            </Link>
                        </div>
                    </>
                ): (
                    <div className="flex flex-col gap-4">
                        <Outlet />
                    </div>
                )}
            </div>
        </div>
    )
}