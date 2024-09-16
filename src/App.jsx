import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from './components/Home';
import Nav from './components/Nav';
import Modal from './components/Modal'
import './styles/css/styles.css'
import { firebaseOnAuthStateChanged, firebaseAuth } from './config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/slices/authSlice';
import { domainCheck, adminCheck } from './utils/domainCheck';
import { Toaster, toast } from 'sonner';

function App() {
  const rootTheme = useRef()
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const [checkUser, setCheckUser] = useState(user ?? null)

  const Layout = () => (
    <>
      <Nav rootTheme={rootTheme} user={user} />
      <div className="mainContainer">
        <Outlet />
      </div>
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
  }, [])


  return (
    <>
      <div ref={rootTheme} className={`root-theme`}>
        <Toaster toastOptions={{
          className: 'toaster',
        }} />
        <Modal />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home section={"main"} user={checkUser} />} />
              <Route path="/contacts" element={<Home section={"contacts"} user={checkUser} />} />
              <Route path="/devices" element={<Home section={"devices"} user={checkUser} />} />
              <Route path="/tdl" element={<Home section={"tdl"} user={checkUser} />} />
              <Route path="/support" element={<Home section={"support"} user={checkUser} />} />
              <Route path="/admin" element={<Home section={"admin"} user={checkUser} />} />
              <Route path="*" element={<Home section={"notFound"} user={checkUser} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
