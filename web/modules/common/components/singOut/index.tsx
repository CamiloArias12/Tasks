import { signOut } from "@/auth"

export async function SignOutAuto() {

    await signOut()

    return null
}
