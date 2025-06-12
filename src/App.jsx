import './styles/css/styles.css'
import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import MainContainer from './components/MainContainer';
import Modal from './components/Modal'
import { firebaseOnAuthStateChanged, firebaseAuth, firebaseDb, firebaseOnSnapshot, firebaseDoc } from './config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/slices/authSlice';
import { domainCheck, adminCheck } from './utils/domainCheck';
import { Toaster } from 'sonner';
import PrivateRoute from "./components/PrivateRoute";
import Contacts from "./components/Contacts";
import Devices from "./components/Devices";
import Home from "./components/Home"
import Support from "./components/Support";
import Admin from "./components/Admin";
import Tasks from "./components/Tasks"
import NotFound from "./components/NotFound"
import Cursor from './components/Cursor';

function App() {
  const rootTheme = useRef()
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const [checkUser, setCheckUser] = useState(user ?? null)


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
      <div ref={rootTheme} className={`root-theme`}>
        <Cursor />
        <Toaster visibleToasts={2} toastOptions={{
          className: 'toaster',
        }} />
        <Modal />
        <BrowserRouter>
          <Routes>
            <Route element={<MainContainer rootTheme={rootTheme} user={checkUser} />}>
              <Route path="/" element={<Home />} />
              <Route path="/contacts" element={checkUser ? <Contacts user={checkUser} /> : <PrivateRoute />} />
              <Route path="/devices" element={checkUser ? <Devices user={checkUser} /> : <PrivateRoute />} />
              <Route path="/tasks" element={checkUser ? <Tasks user={checkUser} /> : <PrivateRoute />} />
              <Route path="/support" element={checkUser ? <Support user={checkUser} /> : <PrivateRoute />} />
              <Route path="/admin" element={checkUser ? <Admin user={checkUser} /> : <PrivateRoute />} />
              <Route path="/*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
