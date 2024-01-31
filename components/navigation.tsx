"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../styles/navigation.module.css";

export default function Navigation(){
    const path = usePathname();
    return (
        <nav className={styles.nav}>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                    {path === "/" ? "🔥" : ""}
                </li>
                <li>
                    <Link href="/main">Main</Link>
                    {path === "/main" ? "🔥" : ""}
                </li>
                <li>
                    <Link href="/calender">Calender</Link>
                    {path === "/calender" ? "🔥" : ""}
                </li>
                <li>
                    <Link href="/oligo">Oligo</Link>
                    {path === "/oligo" ? "🔥" : ""}
                </li>
                <li>
                    <Link href="/pc">PC</Link>
                    {path === "/pc" ? "🔥" : ""}
                </li>
                <li>
                    <Link href="/endProduct">완제품</Link>
                    {path === "/endProduct" ? "🔥" : ""}
                </li>
            </ul>
        </nav>
    )
}