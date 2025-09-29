import { useTranslation } from "../hooks/useTranslation"
import { useSignGoogleMutation } from "../store/slices/apiSlice"
import { toast } from "sonner"

export default function PrivateRoute({ permission = true }) {
    const lang = useTranslation()

    const [signGoogle, resultSignInGoogle] = useSignGoogleMutation()

    const logInGoogle = async () => {
        try {
            const res = await signGoogle()

            toast.message('Auth', {
                description: `${lang.signedIn}: ${res.data.displayName}`,
            });

        } catch {
            toast.message('Auth', {
                description: `${lang.errorSigningIn}`,
            });
        }
    }

    return (
        <>
            <div className="site-section__inner site-section__private">
                {
                    permission ?
                        <>
                            <span> {lang.youMust}&nbsp;</span>
                            <button onClick={() => { logInGoogle() }}>{lang.signIn}</button>
                            <span>&nbsp;{lang.toAccessThisSection}</span>
                        </>
                        :
                        <>
                            <span> {lang.youDont}</span>
                        </>
                }
            </div>
        </>
    )
}