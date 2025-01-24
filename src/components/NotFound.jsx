import { Link } from "react-router"

export default function PrivateRoute() {
  return (
    <>
      <div className="site-section__inner site-section__notFound">
        <div className="site-section__notFound__title">Page not found</div>
        <Link to="/">GO HOME</Link>
      </div>
    </>
  )
}
