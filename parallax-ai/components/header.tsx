import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter()
  return (
    <div className="navbar  bg-base-300 text-primary-content">
        <div className="flex-1">
          {router.pathname === "/dashboard" ?<label htmlFor="my-drawer-2" className="drawer-button text-xl lg:hidden pl-3">≡</label> : null}
          <Link className="btn btn-ghost normal-case text-xl" href="/">🇺🇦 Parallax AI</Link>
        </div>
      {status === "authenticated" ?
        <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            {session.user?.image ?
              <div className="w-10 rounded-full">
                <img src={session.user?.image} />
              </div> : 
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                  <span className="text-xs">{session.user?.name?.charAt(0) ?? session.user?.email?.charAt(0) ?? "U"}</span>
                </div>
              </div>
            }
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <Link href="/dashboard" className="justify-between">
                Dashboard
                <span className="badge">New</span>
              </Link>
            </li>
            <li><a onClick={() => signOut()}>Logout</a></li>
          </ul>
        </div>
      </div> : <button onClick={() => signIn('google')} className="btn gap-2">
  Sign In
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
</button>
     
      }

      
    </div>
    )
}
