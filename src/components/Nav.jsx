import { useDispatch, useSelector } from "react-redux"
import { setLight } from "../store/slices/themeSlice"
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react"
import { useSignGoogleMutation, useSignOutMutation, useGetCurrentUserQuery } from "../store/slices/apiSlice"

export default function Nav({ rootTheme, user }) {
  const dispatch = useDispatch()
  const lightTheme = useSelector(state => state.theme.light)
  const [themeClicked, setThemeClicked] = useState(false)
  const [signGoogle, resultSignInGoogle] = useSignGoogleMutation()
  const [signOut, resultSignOut] = useSignOutMutation()

  const [profileOpts, setProfileOpts] = useState(false)

  /*   const {
      data,
      isLoading,
      isSuccess,
      isError,
      error,
    } = useGetCurrentUserQuery(); */

  const toggleLight = () => {
    setThemeClicked(true)
    dispatch(setLight({ light: !lightTheme }))
  }

  const logInGoogle = async () => {
    await signGoogle()
  }

  useEffect(() => {
    rootTheme.current.classList.toggle("light-theme", lightTheme)
  }, [lightTheme])

  return (
    <header className="mainHeader">
      <Link className="logo" to="/">IT DASHBOARD</Link>
      <div className="mainHeader__btnContainer">
        <div className="themeBtn">
          <button onClick={toggleLight} onAnimationEnd={() => setThemeClicked(false)}>
            {lightTheme ?
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={themeClicked && "theme-clicked"} viewBox="0 0 16 16">
                <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278" />
              </svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={themeClicked && "theme-clicked"} viewBox="0 0 16 16">
                <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
              </svg>
            }

          </button>
        </div>
        <div className="themeBtn">
          {user ?
            <>
              <button className={`profileBtn ${profileOpts && "profileOn"}`} onClick={() => setProfileOpts(!profileOpts)}>
                <img alt="profile-pic" src={user.photoURL} />
              </button>
              {
                profileOpts &&
                <div className="profile-opts">
                  <button onClick={() => { signOut() }}>
                    Sign out
                  </button>
                </div>
              }
            </>
            :
            <>
              <button className={`profileBtn ${profileOpts && "profileOn"}`} onClick={() => setProfileOpts(!profileOpts)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
              </button>
              {
                profileOpts &&
                <div className="profile-opts">
                  <button onClick={() => { logInGoogle() }}>
                    Sign in
                  </button>
                </div>
              }
            </>
          }
        </div>
      </div>
    </header>
  )
}
