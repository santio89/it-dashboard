import './styles/css/styles.css'
import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Main from './components/Main';
import Nav from './components/Nav';
import Modal from './components/Modal'
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
  }, [])


  return (
    <>
      <div ref={rootTheme} className={`root-theme`}>
        <Toaster visibleToasts={2} toastOptions={{
          className: 'toaster',
        }} />
        <Modal />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Main rootTheme={rootTheme} section={"home"} user={checkUser} />} />
              <Route path="/contacts" element={<Main rootTheme={rootTheme} section={"contacts"} user={checkUser} />} />
              <Route path="/devices" element={<Main rootTheme={rootTheme} section={"devices"} user={checkUser} />} />
              <Route path="/tdl" element={<Main rootTheme={rootTheme} section={"tasks"} user={checkUser} />} />
              <Route path="/support" element={<Main rootTheme={rootTheme} section={"support"} user={checkUser} />} />
              <Route path="/admin" element={<Main rootTheme={rootTheme} section={"admin"} user={checkUser} />} />
              <Route path="*" element={<Main rootTheme={rootTheme} section={"notFound"} user={checkUser} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
