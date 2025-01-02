import { Link } from "react-router-dom"
import SpotlightCard from "./SpotlightCard"


export default function Home() {

  return (
    <>

      <SpotlightCard className="homeCard" spotlightColor="var(--main-color-op)">
        <Link className="homeCard__link" to="/contacts">
          <h2>Contacts</h2>
          <p>Manage contacts</p>
        </Link>
      </SpotlightCard>
      <SpotlightCard className="homeCard" spotlightColor="var(--main-color-op)">
        <Link className="homeCard__link" to="/devices">
          <h2>Devices</h2>
          <p>Manage devices</p>
        </Link>
      </SpotlightCard>
      <SpotlightCard className="homeCard" spotlightColor="var(--main-color-op)">
        <Link className="homeCard__link" to="/tdl">
          <h2>Tasks</h2>
          <p>Manage tasks</p>
        </Link>
      </SpotlightCard>
      <SpotlightCard className="homeCard" spotlightColor="var(--main-color-op)">
        <Link className="homeCard__link" to="/support">
          <h2>Support</h2>
          <p>Contact support</p>
        </Link>
      </SpotlightCard>
    </>
  )
}
