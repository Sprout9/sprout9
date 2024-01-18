import Link from "next/link"
import { lusitana } from "@/app/lib/fonts"
import { PlanetIcon } from "./icons"

export default function Logo() {
    return (
        <Link
            className="sidebar-header"
            href="/"
        >
            <PlanetIcon />
            <div className={`${lusitana.className} sidebar-header-text`}>
                Sprout9 Forms
            </div>
        </Link>
    )
}