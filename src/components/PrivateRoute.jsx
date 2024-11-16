import { useSignGoogleMutation } from "../store/slices/apiSlice"

export default function PrivateRoute() {
    return (
        <>
            <div className="site-section__inner">
                You must sign in to access this section
            </div>
        </>
    )
}
