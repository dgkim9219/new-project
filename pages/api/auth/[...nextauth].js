import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


export default NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text", placeholder: "아이디" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                
                // Add logic here to look up the user from the credentials supplied
                // const user = { id: 1, name: "J Smith", email: "jsmith@example.com" }
                const db = await open({
                    filename: './my_DB.db',
                    driver: sqlite3.Database,
                });
                const userId = credentials.username;
                const userPW = credentials.password;


                const user = await db.get('SELECT * FROM USERLIST WHERE userId = ? AND userPw = ?', userId, userPW);

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT

                    return user;
                    
                    
                } else {
                    // If you return null or false then the credentials will be rejected
                    return (
                        null
                        )
                    // You can also Reject this callback with an Error or with a URL:
                    // throw new Error("error message") // Redirect to error page
                    // throw "/path/to/redirect"        // Redirect to a URL
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 10 * 60 * 60, // 로그인 유지 기간 (=1시간 * 분 * 초)
      },

    callbacks: {
        async jwt({ token, user }) {

          return { ...token, ...user };
        },
    
        async session({ session, token }) {
          session.user = token ;

          return session;
        },
      },
        
    }

)