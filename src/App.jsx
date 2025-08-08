import './styles/css/styles.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import MainContainer from './components/MainContainer';
import Modal from './components/Modal'
import { firebaseOnAuthStateChanged, firebaseAuth } from './config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/slices/authSlice';
import { domainCheck, adminCheck } from './utils/domainCheck';
import { Toaster } from 'sonner';
import PrivateRoute from "./components/PrivateRoute";
import Contacts from "./components/Contacts";
import Devices from "./components/Devices";
import Home from "./components/Home"
import Support from "./components/Support";
import AIBot from './components/AIBot';
import Admin from "./components/Admin";
import Tasks from "./components/Tasks"
import NotFound from "./components/NotFound"
import MainSection from './components/MainSection';

function App() {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const [checkUser, setCheckUser] = useState(user ?? null)

  const lightTheme = useSelector(state => state.theme.light)

  useEffect(() => {
    if (user) {
      const domainUser = domainCheck(user.email)
      const domainAdmin = adminCheck(user.email)
      setCheckUser({
        ...user,
        domainUser,
        domainAdmin
      })
    } else {
      setCheckUser(null)
    }
  }, [user])

  useEffect(() => {
    firebaseOnAuthStateChanged(firebaseAuth, (currentUser) => {
      dispatch(setUser(currentUser))
    })
  }, [])


  return (
    <>
      <div className={`root-theme ${lightTheme ? "light-theme" : ""}`}>
        <BrowserRouter>
          <Routes>
            <Route element={<MainContainer user={checkUser} />}>
              <Route path="/" element={<Home />} />
              <Route path="/contacts" element={checkUser ? <MainSection user={checkUser} section={"contacts"} /> : <PrivateRoute />} />
              <Route path="/devices" element={checkUser ? <MainSection user={checkUser} section={"devices"} /> : <PrivateRoute />} />
              <Route path="/tasks" element={checkUser ? <MainSection user={checkUser} section={"tasks"} /> : <PrivateRoute />} />
              <Route path="/support" element={checkUser ? <MainSection user={checkUser} section={"support"} /> : <PrivateRoute />} />
              <Route path="/ai" element={checkUser ? <AIBot user={checkUser} /> : <PrivateRoute />} />
              <Route path="/admin" element={checkUser ? <Admin user={checkUser} /> : <PrivateRoute />} />
              <Route path="/*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Modal />
        <Toaster visibleToasts={2} toastOptions={{
          className: 'toaster',
        }} />
      </div>
    </>
  )
}

export default App
