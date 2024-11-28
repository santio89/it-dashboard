import { useEffect } from "react"

function ProfileDataModal({ modalData }) {

  useEffect(() => {
    console.log(modalData)
  }, [modalData])


  return (
    <>
      {
        modalData?.profileData &&
        <>
          <div className="mainModal__titleContainer">
            <h2>PROFILE</h2>
            <div>ID: <span>{modalData?.uid}</span></div>
            <div className="listPickerWrapper__btnContainer">
              {
                <button tabIndex={-1} className={`listPicker disabled`} >Profile</button>
              }
            </div>
          </div>
          <form className='mainModal__data__form profile disabled'>
            <div className="form-group">
              <div className="profilePicWrapper">
                <img src={modalData?.photoURL} alt="Profile pic" />
              </div>
              <fieldset>
                <legend>Name</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Name" value={modalData?.displayName || "-"} />
              </fieldset>
              <fieldset>
                <legend>E-Mail</legend>
                <input readOnly disabled spellCheck={false} type="text" title="E-Mail" value={modalData?.email || "-"} />
              </fieldset>
            </div>
          </form>
        </>
      }

    </>
  )
}

export default ProfileDataModal