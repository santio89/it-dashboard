import { useState, useEffect } from "react"
import { useSearchParams, NavLink } from "react-router-dom";
import Users from "./Users";
import Devices from "./Devices";
import Main from "./Main"
import Contact from "./Contact";
import Admin from "./Admin";
import TDL from "./TDL"

export default function Home({ section }) {
  const [sideExpanded, setSideExpanded] = useState(false)
  /*   const [searchParams, setSearchParams] = useSearchParams({ q: false, a: false }) */


  return (
    <div className="home">
      <aside className={`side-panel ${sideExpanded && "expanded"}`}>
        <div className="side-panel__opts">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/devices">Devices</NavLink>
          <NavLink to="/tdl">TDL</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </div>

        <button className="side-toggle" onClick={() => setSideExpanded(sideExpanded => !sideExpanded)}>Toggle</button>
      </aside>
      <main className="main-content">
        {section === "main" && <Main />}
        {section === "users" && <Users />}
        {section === "devices" && <Devices />}
        {section === "tdl" && <TDL />}
        {section === "contact" && <Contact />}
        {section === "admin" && <Admin />}
      </main>

    </div>
  )
}
