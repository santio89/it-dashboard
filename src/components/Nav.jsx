import { useDispatch, useSelector } from "react-redux"
import { setLight } from "../store/slices/themeSlice"
import { setModal } from "../store/slices/modalSlice"
import { useLocation } from "react-router"
import { useEffect, useState } from "react"
import { useSignGoogleMutation, useSignOutMutation } from "../store/slices/apiSlice"

const sections = ["/home", "/about", "/contacts", "/devices", "/tasks", "/support", "/admin"]

export default function Nav({ rootTheme, user }) {
  const dispatch = useDispatch()
  const lightTheme = useSelector(state => state.theme.light)
  const [themeClicked, setThemeClicked] = useState(false)
  const [signGoogle, resultSignInGoogle] = useSignGoogleMutation()
  const [signOut, resultSignOut] = useSignOutMutation()
  const [profileOpts, setProfileOpts] = useState(false)
  const location = useLocation()

  const toggleLight = () => {
    setThemeClicked(true)
    dispatch(setLight({ light: !lightTheme }))
  }

  const logInGoogle = async () => {
    await signGoogle()
  }

  const setOpts = () => {
    setProfileOpts(!profileOpts)
  }

  const openProfile = () => {
    dispatch(setModal({ active: true, data: { modalType: "ProfileDataModal", profileData: true, ...user } }))
  }

  useEffect(() => {
    rootTheme.current.classList.toggle("light-theme", lightTheme)
  }, [lightTheme])

  return (
    <header className="mainHeader">
      <div className="logo" >{sections.find(section => section === location.pathname.trim()) ? location.pathname.trim().slice(1) : "IT DASHBOARD"}</div>
      <div className="mainHeader__btnContainer">
        <div className="btnWrapper">
          <button aria-label="Dark/Light Mode" onClick={toggleLight} onAnimationEnd={() => setThemeClicked(false)}>
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
        <div className="btnWrapper">
          {user ?
            <button aria-label="Profile" className={`profileBtn ${profileOpts && "profileOn"}`} onClick={() => setProfileOpts(!profileOpts)}>
              <img alt="profile-pic" src={user.photoURL} />
            </button>
            :
            <button aria-label="Profile" className={`profileBtn ${profileOpts && "profileOn"}`} onClick={() => setOpts()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
            </button>
          }

          {
            <div className={`profile-opts ${profileOpts && "open"}`}>
              {
                user ?
                  <>
                    <button tabIndex={profileOpts ? 0 : -1} onClick={() => { openProfile() }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
                      </svg>
                      <span>Profile</span>
                    </button>
                    <button tabIndex={profileOpts ? 0 : -1} onClick={() => { signOut() }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                      </svg>
                      <span>Sign out</span>
                    </button>
                  </>
                  :
                  <>
                    <button tabIndex={profileOpts ? 0 : -1} onClick={() => { logInGoogle() }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                        <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                      </svg>
                      <span>
                        Sign in
                      </span>
                    </button>
                  </>
              }
            </div>
          }
        </div>
      </div>
    </header>
  )
}
