import { useTranslation } from "../hooks/useTranslation"

function ProfileDataModal({ modalData }) {
  const lang = useTranslation()


  return (
    <>
      {
        modalData?.profileData &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.profile}</h2>
            <div>ID: <span>{modalData?.uid}</span></div>
            <div className="listPickerWrapper__btnContainer">
              {
                <button tabIndex={-1} className={`listPicker disabled selected`} >{modalData?.domainAdmin ? lang.admin : lang.user}</button>
              }
            </div>
          </div>
          <form className='mainModal__data__form profile disabled'>
            <div className="form-group">
              <div className="profilePicWrapper">
                <img src={modalData?.photoURL} alt="Profile pic" />
              </div>
              <fieldset>
                <legend><label htmlFor="name">{lang.name}</label></legend>
                <input id="name" readOnly disabled spellCheck={false} type="text" value={modalData?.displayName || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="email">{lang.eMail}</label></legend>
                <input id="email" readOnly disabled spellCheck={false} type="text" value={modalData?.email || "-"} />
              </fieldset>
            </div>
          </form>
        </>
      }

    </>
  )
}

export default ProfileDataModal