import { Link } from "react-router"
import SpotlightCard from "./SpotlightCard"


export default function Home() {

  return (
    <>

      <SpotlightCard className="homeCard" spotlightColor="var(--main-color-op)">
        <Link className="homeCard__link" to="/contacts" viewTransition>
          <h2>Contacts</h2>
          <p>Manage contacts</p>
        </Link>
      </SpotlightCard>
      <SpotlightCard className="homeCard" spotlightColor="var(--main-color-op)">
        <Link className="homeCard__link" to="/devices" viewTransition>
          <h2>Devices</h2>
          <p>Manage devices</p>
        </Link>
      </SpotlightCard>
      <SpotlightCard className="homeCard" spotlightColor="var(--main-color-op)">
        <Link className="homeCard__link" to="/tasks" viewTransition>
          <h2>Tasks</h2>
          <p>Manage tasks</p>
        </Link>
      </SpotlightCard>
      <SpotlightCard className="homeCard" spotlightColor="var(--main-color-op)">
        <Link className="homeCard__link" to="/support" viewTransition>
          <h2>Support</h2>
          <p>Contact support</p>
        </Link>
      </SpotlightCard>
    </>
  )
}
