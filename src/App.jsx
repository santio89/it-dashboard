import './styles/css/styles.css'
import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import MainContainer from './components/MainContainer';
import Nav from './components/Nav';
import Modal from './components/Modal'
import { firebaseOnAuthStateChanged, firebaseAuth, firebaseDb, firebaseOnSnapshot, firebaseDoc } from './config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/slices/authSlice';
import { domainCheck, adminCheck } from './utils/domainCheck';
import { Toaster, toast } from 'sonner';

import PrivateRoute from "./components/PrivateRoute";
import Contacts from "./components/Contacts";
import Devices from "./components/Devices";
import Home from "./components/Home"
import Support from "./components/Support";
import Admin from "./components/Admin";
import TDL from "./components/TDL"
import NotFound from "./components/NotFound"

function App() {
  const rootTheme = useRef()
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const [checkUser, setCheckUser] = useState(user ?? null)

  const Layout = () => (
    <>
      {/* <Nav rootTheme={rootTheme} user={user} /> */}
      <Outlet />
    </>
  );

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

    /* firebaseOnSnapshot(firebaseDoc(firebaseDb, "authUsersData", "SF"), (doc) => {
      console.log("Current data: ", doc.data());
  }); */

  }, [])


  return (
    <>
      <div ref={rootTheme} className={`root-theme`}>
        <Toaster visibleToasts={2} toastOptions={{
          className: 'toaster',
        }} />
        <Modal />
        <BrowserRouter future={{
          v7_startTransition: true,
        }}>
          <Routes>
            <Route element={<MainContainer rootTheme={rootTheme} user={checkUser} />}>
              <Route path="/" element={<Home />} />
              {<Route path="/contacts" element={checkUser ? <Contacts user={checkUser} /> : <PrivateRoute />} />}
              {<Route path="/devices" element={checkUser ? <Devices user={checkUser} /> : <PrivateRoute />} />}
              {<Route path="/tdl" element={checkUser ? <TDL user={checkUser} /> : <PrivateRoute />} />}
              {<Route path="/support" element={checkUser ? <Support user={checkUser} /> : <PrivateRoute />} />}
              {<Route path="/admin" element={checkUser ? <Admin user={checkUser} /> : <PrivateRoute />} />}
              <Route path="/*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
