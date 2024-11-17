import { Link } from "react-router-dom"


export default function Home() {

  return (
    <>
      <div className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/contacts">
          <h2>Contacts</h2>
          <p>Manage contacts</p>
        </Link>
      </div>
      <div className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/devices">
          <h2>Devices</h2>
          <p>Manage devices</p>
        </Link>
      </div>
      <div className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/tdl">
          <h2>Tasks</h2>
          <p>Manage tasks</p>
        </Link>
      </div>
      <div className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/support">
          <h2>Support</h2>
          <p>Contact support</p>
        </Link>
      </div>
    </>
  )
}
