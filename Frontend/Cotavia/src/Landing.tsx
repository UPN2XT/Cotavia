import { Link } from "react-router"

export default function() {
    return (
        <>
            <nav className="fixed w-screen flex justify-end p-4">
                    <Link className="text-lg font-medium" to="app">
                        Get Started
                    </Link>
            </nav>
            <div className="h-screen w-screen flex select-none">
                <div className="h-full w-1/2 bg-neutral-950 flex justify-center items-end flex-col gap-8">
                    <div className="text-white text-9xl">
                        <div>
                            Cod
                        </div>  
                        <div className="relative bg-white h-[5%] w-3/5">

                        </div>
                    </div>
                    
                </div>
                <div className="h-full w-1/2 flex justify-center items-start flex-col gap-8">
                    <div className="text-9xl">
                        <div className="relative bg-black h-[5%] w-3/5 ml-28">

                        </div>  
                        <div>
                            avia
                        </div>  
                    </div>
                </div>
            </div>
        </>
        
    )
}