import { Link } from "react-router-dom"


export default function Home() {

  return (
    <>
      <div style={{ viewTransitionName: "homeCard-1" }} className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/contacts">
          <h2>Contacts</h2>
          <p>Manage contacts</p>
        </Link>
      </div>
      <div style={{ viewTransitionName: "homeCard-2" }} className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/devices">
          <h2>Devices</h2>
          <p>Manage devices</p>
        </Link>
      </div>
      <div style={{ viewTransitionName: "homeCard-3" }} className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/tdl">
          <h2>Tasks</h2>
          <p>Manage tasks</p>
        </Link>
      </div>
      <div style={{ viewTransitionName: "homeCard-4" }} className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/support">
          <h2>Support</h2>
          <p>Contact support</p>
        </Link>
      </div>
    </>
  )
}
