import { Link } from "react-router"
import SpotlightCard from "./SpotlightCard"
import { useTranslation } from "../hooks/useTranslation"


export default function Home() {
  const lang = useTranslation()

  return (
    <>
      <SpotlightCard className="homeCard">
        <Link className="homeCard__link" to="/contacts" viewTransition>
          <h2>{lang.contacts}</h2>
          <p>{lang.manageContacts}</p>
        </Link>
      </SpotlightCard>
      <SpotlightCard className="homeCard">
        <Link className="homeCard__link" to="/devices" viewTransition>
          <h2>{lang.devices}</h2>
          <p>{lang.manageDevices}</p>
        </Link>
      </SpotlightCard>
      <SpotlightCard className="homeCard">
        <Link className="homeCard__link" to="/tasks" viewTransition>
          <h2>{lang.tasks}</h2>
          <p>{lang.manageTasks}</p>
        </Link>
      </SpotlightCard>
      <SpotlightCard className="homeCard">
        <Link className="homeCard__link" to="/support" viewTransition>
          <h2>{lang.support}</h2>
          <p>{lang.requestSupport}</p>
        </Link>
      </SpotlightCard>
    </>
  )
}
