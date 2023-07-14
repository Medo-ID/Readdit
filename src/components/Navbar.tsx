import Link from "next/link"
// import { Icons } from "./Icons"
import { buttonVariants } from "./ui/Button"
import { getAuthSession } from "@/lib/auth"
import UserAccountNav from "./UserAccountNav"
import SearchBar from "./SearchBar"
import Image from "next/image"

const Navbar = async () => {

    const session = await getAuthSession()

    return(
        <div className="sticky top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
            <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
                <Link href='/' className="flex gap-2 items-center">
                    <Image src="/favicon.png" alt="app-logo" height={500} width={500} className="h-8 w-10 sm:h-6 sm:w-6" />
                    <p className="hidden text-zinc-700 text-sm font-medium md:block">Readdit</p>
                </Link>
                
                {/* Search Bar */}
                
                <SearchBar />
                
                {/* Actions */}
                {session?.user ?(
                    <UserAccountNav user={session.user} />
                ) : (
                    <Link href='/sign-in' className={buttonVariants()}>Sign In</Link>
                )}

            </div>
        </div>
    ) 
}

export default Navbar