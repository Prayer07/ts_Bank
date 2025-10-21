import NextAuth, { CredentialsSignin } from "next-auth"
import Google from "next-auth/providers/google"
import { connectDB } from "./lib/db"
import Users from "./models/Users"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// class CustomError extends CredentialsSignin{
//     constructor(code: string){
//         super()
//         this.code = code
//         this.message = code
//         this.stack = undefined
//     }
// }


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google, 
        // Credentials({
        // // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // // e.g. domain, username, password, 2FA token, etc.
        // credentials: {
        //     email: {},
        //     password: {},
        // },
        // authorize: async (credentials) => {
        //     await connectDB()

        //     const user = await Users.findOne({email: credentials?.email})

        //     if(!user){
        //         throw new CustomError("Invalid Credentials")
        //     }
    
        //     if (!user) {
        //     // No user found, so this is their first attempt to login
        //     // Optionally, this is also the place you could do a user registration
        //     throw new CustomError("Invalid credentials.")
        //     }

        //     // logic to verify if the user exists
        //     const isMatch = await bcrypt.compare(
        //         (credentials?.password as string) ?? "",
        //         user.password
        //     )

        //     if(!isMatch) {
        //         throw new CustomError("Invalid password")
        //     }
    
    
        //     // return user object with their profile data
        //     return user
        // },
    // }),
    ],
    callbacks: {
        async signIn({user, account, profile}){
            if(account?.provider === "google"){
                await connectDB()

                const existingUser = await Users.findOne({
                    email: profile?.email
                })

                const accountNo = Math.floor(1000000000 + Math.random() * 9000000000);

                if(!existingUser){
                    const newUser = await Users.create({
                        fullname: profile?.name,
                        email: profile?.email,
                        balance: 0,
                        accountNo
                    })

                    user.id = newUser._id.toString()
                }else {
                    user.id = existingUser._id.toString()
                }
            }
            return true
        },

        async session({ session, token }){
            await connectDB()

            let user = await Users.findOne({ email: session.user?.email})

            const accountNo = Math.floor(1000000000 + Math.random() * 9000000000);
            
            if(!user){
                user = await Users.create({
                    email:session.user?.email,
                    fullname: session.user?.name,
                    balance: 0,
                    accountNo,
                })
            }

            session.user.id = user._id.toString()
            return session
        }
    }
})