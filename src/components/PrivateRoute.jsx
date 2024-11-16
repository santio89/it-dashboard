import { useSignGoogleMutation } from "../store/slices/apiSlice"

export default function PrivateRoute() {
    const [signGoogle, resultSignInGoogle] = useSignGoogleMutation()

    const logInGoogle = async () => {
        await signGoogle()
    }

    return (
        <>
            <div className="site-section__inner site-section__private">
                You must&nbsp;<button onClick={() => { logInGoogle() }}>sign in</button>&nbsp;to access this section
            </div>
        </>
    )
}
