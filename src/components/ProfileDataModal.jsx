
function ProfileDataModal({ modalData }) {


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
                <button tabIndex={-1} className={`listPicker disabled selected`} >Personal</button>
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
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.displayName || "-"} />
              </fieldset>
              <fieldset>
                <legend>E-Mail</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.email || "-"} />
              </fieldset>
            </div>
          </form>
        </>
      }

    </>
  )
}

export default ProfileDataModal