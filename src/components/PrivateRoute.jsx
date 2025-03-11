import { useTranslation } from "../hooks/useTranslation"
import { useSignGoogleMutation } from "../store/slices/apiSlice"

export default function PrivateRoute() {
    const lang = useTranslation()

    const [signGoogle, resultSignInGoogle] = useSignGoogleMutation()

    const logInGoogle = async () => {
        await signGoogle()
    }

    return (
        <>
            <div className="site-section__inner site-section__private">
                <span> {lang.youMust}&nbsp;</span>
                <button onClick={() => { logInGoogle() }}>{lang.signIn}</button>
                <span>&nbsp;{lang.toAccessThisSection}</span>
            </div>
        </>
    )
}
