import { Link } from "react-router-dom"

export default function Home() {
  return (
    <>
      <div className="site-section__inner home">
        <div className="site-section__homeCards">
          <Link className="homeCard" to="/contacts">
            <div className="full-bg"></div>
            <h2>Contacts</h2>
            <p>Manage contacts</p>
          </Link>
          <Link className="homeCard" to="/devices">
            <div className="full-bg"></div>
            <h2>Devices</h2>
            <p>Manage devices</p>
          </Link>
          <Link className="homeCard" to="/tdl">
            <div className="full-bg"></div>
            <h2>Tasks</h2>
            <p>Manage tasks</p>
          </Link>
          <Link className="homeCard" to="/support">
            <div className="full-bg"></div>
            <h2>Support</h2>
            <p>Contact support</p>
          </Link>
        </div>
      </div>
    </>
  )
}
