import { Link } from "react-router-dom"

export default function Home() {
  return (
    <>
      <div className="site-section__inner home">
        <div className="site-section__homeCards">
          <Link className="homeCard" to="/contacts">
            <h2>Contacts</h2>
            <p>Manage contacts</p>
          </Link>
          <Link className="homeCard" to="/devices">
            <h2>Devices</h2>
            <p>Manage devices</p>
          </Link>
          <Link className="homeCard" to="/tdl">
            <h2>Tasks</h2>
            <p>Manage tasks</p>
          </Link>
          <Link className="homeCard" to="/support">
            <h2>Support</h2>
            <p>Contact support</p>
          </Link>
        </div>
      </div>
    </>
  )
}
