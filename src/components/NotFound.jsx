import { Link } from "react-router"
import { useTranslation } from "../hooks/useTranslation"

export default function PrivateRoute() {
   const lang = useTranslation()

  return (
    <>
      <div className="site-section__inner site-section__notFound">
        <div className="site-section__notFound__title">{lang.resourceNotFound}</div>
        <Link to="/">{lang.goHome}</Link>
      </div>
    </>
  )
}
