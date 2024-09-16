import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Contacts from "./Contacts";
import Devices from "./Devices";
import Main from "./Main"
import Support from "./Support";
import Admin from "./Admin";
import TDL from "./TDL"
import NotFound from "./NotFound"
import { useSelector, useDispatch } from "react-redux";
import { setSideExpanded } from "../store/slices/themeSlice";

export default function Home({ section, user }) {
  const sideExpanded = useSelector(state => state.theme.sideExpanded)
  const dispatch = useDispatch()


  return (
    <div className="home">
      <aside className={`side-panel ${sideExpanded && "expanded"}`}>
        <div className="side-panel__opts">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/contacts" className={!user && "nav-link-disabled"}>Contacts</NavLink>
          <NavLink to="/devices" className={!user && "nav-link-disabled"}>Devices</NavLink>
          <NavLink to="/tdl" className={!user && "nav-link-disabled"}>TDL</NavLink>
          <NavLink to="/support" className={!user && "nav-link-disabled"}>Support</NavLink>
          <NavLink to="/admin" className={!user && "nav-link-disabled"}>Admin</NavLink>
        </div>

        <button title="Toggle layout" className={`side-toggle ${sideExpanded && "expanded"}`} onClick={() => dispatch(setSideExpanded({ sideExpanded: !sideExpanded }))}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-layout-split" viewBox="0 0 16 16">
            <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5-1v12H14a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-1 0H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5.5z" />
          </svg>
        </button>
      </aside>
      <main className={`main-content ${sideExpanded && "expanded"}`}>
        {section === "main" && <Main />}
        {user && section === "contacts" && <Contacts user={user} />}
        {user && section === "devices" && <Devices user={user} />}
        {user && section === "tdl" && <TDL user={user} />}
        {user && section === "support" && <Support user={user} />}
        {user && section === "admin" && <Admin user={user} />}
        {!user && section !== "main" && section !== "notFound" && <PrivateRoute />}
        {section === "notFound" && <NotFound />}
      </main>
    </div>
  )
}
