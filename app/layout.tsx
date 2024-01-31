import "../styles/global.css";
import Navigation from "../components/navigation";
import {Metadata} from "next";


export const metadata: Metadata = {
  title: {
    template: "%s | 진단시약생산팀",
    default: "진단시약생산팀",
  },
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Navigation />
        {children}
        </body>
    </html>
  )
}
