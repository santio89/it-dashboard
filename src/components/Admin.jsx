import { useTranslation } from "../hooks/useTranslation"

export default function Admin({ user }) {
  const lang = useTranslation()

  return (
    <>
      <div className="site-section__inner site-section__admin">
        <div className="site-section__admin__title">
          {lang.admin.toUpperCase()}
        </div>
      </div>
    </>
  )
}
