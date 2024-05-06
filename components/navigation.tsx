"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../styles/navigation.module.css";

export default function Navigation(){
    const path = usePathname();
    return (
        <nav className={styles.nav}>
            <ul>
                <li className={path === "/" ? styles.active : ""}>
                    <Link href="/">Home</Link>
                </li>
                <li className={path === "/main" ? styles.active : ""}>
                    <Link href="/main">Main</Link>
                </li>
                <li className={path === "/calender" ? styles.active : ""}>
                    <Link href="/calender">Calender</Link>
                </li>
                <li className={path === "/oligo" ? styles.active : ""}>
                    <Link href="/oligo">Oligo</Link>
                </li>
                <li className={path === "/pc" ? styles.active : ""}>
                    <Link href="/pc">PC</Link>
                </li>
                <li className={path === "/endProduct" ? styles.active : ""}>
                    <Link href="/endProduct">완제품</Link>
                </li>
            </ul>
        </nav>
    )
}