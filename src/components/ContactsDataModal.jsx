import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import { useAddContactCompanyMutation, useDeleteContactCompanyMutation, useEditContactCompanyMutation, useAddContactMutation, useDeleteContactMutation, useEditContactMutation } from '../store/slices/apiSlice';
import { objectEquality } from '../utils/objectEquality';

export default function ContactsDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)

  const [listPickerOpen, setListPickerOpen] = useState(false)

  /*   const [addContactCompany, resultAddContactCompany] = useAddContactCompanyMutation()
    const [deleteContactCompany, resultDeleteContactCompany] = useDeleteContactCompanyMutation()
    const [editContactCompany, resultEditContactCompany] = useEditContactCompanyMutation() */

  const [addContact, resultAddContact] = useAddContactMutation()
  const [deleteContact, resultDeleteContact] = useDeleteContactMutation()
  const [editContact, resultEditContact] = useEditContactMutation()

  const [newUserName, setNewUserName] = useState("")
  const [newUserArea, setNewUserArea] = useState("")
  const [newUserLocation, setNewUserLocation] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserTel, setNewUserTel] = useState("")
  const [newUserRole, setNewUserRole] = useState("")
  const [newUserComment, setNewUserComment] = useState("")
  const [newUserCategory, setNewUserCategory] = useState("personal")

  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  const selectList = list => {
    setNewUserCategory(list)
    setListPickerOpen(false)
  }

  const addUserFn = async (e) => {
    e.preventDefault()
    const user = {
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      tel: newUserTel.trim(),
      role: newUserRole.trim(),
      area: newUserArea.trim(),
      location: newUserLocation.trim(),
      comment: newUserComment.trim(),
      category: newUserCategory.trim(),
    }

    await addContact({ ...user, userId: modalData.userId })

    dispatch(setModal({ active: false, data: {} }))
  }

  const deleteUserFn = async (contact) => {
    await deleteContact(contact)

    /* timeout-refetch */
    setTimeout(() => {
      dispatch(setModal({ active: false, data: {} }))
    }, 500)
  }

  const editModeFN = () => {
    setNewUserName(modalData?.name)
    setNewUserArea(modalData?.area)
    setNewUserLocation(modalData?.location)
    setNewUserEmail(modalData?.email)
    setNewUserTel(modalData?.tel)
    setNewUserRole(modalData?.role)
    setNewUserComment(modalData?.comment)
    setNewUserCategory(modalData?.category)
    setEditMode(true)
  }

  const editUserFn = async (e, contact) => {
    e.preventDefault()
    const newUser = {
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      tel: newUserTel.trim(),
      role: newUserRole.trim(),
      area: newUserArea.trim(),
      location: newUserLocation.trim(),
      comment: newUserComment.trim(),
      category: newUserCategory.trim(),
      id: contact.id,
      userId: contact.userId
    }

    const { userData, createdAt, updatedAt, ...oldUser } = contact
    const contactEquality = objectEquality(oldUser, newUser)

    if (contactEquality) {
      dispatch(setModal({ active: false, data: {} }))
      return
    } else {
      await editContact({ ...newUser, userId: modalData.userId })

      /* timeout-refetch */
      setTimeout(() => {
        dispatch(setModal({ active: false, data: {} }))
      }, 500)
    }
  }

  useEffect(() => {
    if (!modalActive) {
      setNewUserName("")
      setNewUserArea("")
      setNewUserLocation("")
      setNewUserEmail("")
      setNewUserTel("")
      setNewUserRole("")
      setNewUserComment("")
      setNewUserCategory(modalData?.listSelected == "all" ? "personal" : modalData?.listSelected)
      setListPickerOpen(false)
      setEditMode(false)
      setDeleteMode(false)
    }
  }, [modalActive])

  useEffect(() => {
    setListPickerOpen(false)
  }, [deleteMode, editMode])

  return (
    <>
      {modalData?.userData && !editMode && !deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>CONTACT</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              {
                <button tabIndex={-1} className={`listPicker disabled`} >{modalData?.category === "company" ? "Company" : "Personal"}</button>
              }
            </div>
          </div>
          <form className='mainModal__data__form disabled'>
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Name" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend>E-Mail</legend>
                <input readOnly disabled spellCheck={false} type="text" title="E-Mail" value={modalData?.email || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Tel</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Tel" value={modalData?.tel || "-"} />
              </fieldset>
              <fieldset>
                <legend>Role</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Role" value={modalData?.role || "-"} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Area" value={modalData?.area || "-"} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select readOnly disabled title="Location">
                  <option readOnly disabled value="" selected={modalData?.location === ""} >-</option>
                  <option readOnly disabled value="SS" selected={modalData?.location === "SS"}>SS</option>
                  <option readOnly disabled value="PB" selected={modalData?.location === "PB"}>PB</option>
                  <option readOnly disabled value="1P" selected={modalData?.location === "1P"}>1P</option>
                  <option readOnly disabled value="4P" selected={modalData?.location === "4P"}>4P</option>
                </select>
              </fieldset>
            </div> */}

            <div className="form-group">
              <fieldset>
                <legend>Comment</legend>
                <textarea readOnly disabled spellCheck={false} rows="2" title="Comment" value={modalData?.comment || "-"} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => editModeFN()}>Edit</button>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(true)}>Delete</button>
            </div>
          </form>
        </>
      }

      {modalData?.userData && editMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>EDIT CONTACT</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer editMode">
              {
                <button disabled={resultEditContact.isLoading} className={`listPicker ${listPickerOpen && "selected"} ${resultEditContact.isLoading && "disabled"}`} onClick={() => listPickerOpen ? selectList(newUserCategory === "personal" ? "personal" : "company") : setListPickerOpen(true)}>{newUserCategory === "personal" ? "Personal" : "Company"}</button>
              }
              {
                listPickerOpen &&
                <div className="listPickerOptions">
                  <button className={`listPicker`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button className={`listPicker`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                </div>
              }
            </div>
          </div>
          <form className='mainModal__data__form editMode' onSubmit={(e) => editUserFn(e, modalData)} disabled={resultEditContact.isLoading}>
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input spellCheck={false} type="text" title="Name" value={newUserName} onChange={e => setNewUserName(e.target.value.trimStart())} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend>E-Mail</legend>
                <input spellCheck={false} type="text" title="E-Mail" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value.trimStart())} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Tel</legend>
                <input spellCheck={false} type="tel" title="Tel" value={newUserTel} onChange={e => {
                  const value = e.target.value.replace(/\D/g, '').trimStart();
                  setNewUserTel(value)
                }} maxLength={20} />
              </fieldset>
              <fieldset>
                <legend>Role</legend>
                <input spellCheck={false} type="text" title="Role" value={newUserRole} onChange={e => setNewUserRole(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
            </div>

            {/*     <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input spellCheck={false} type="text" title="Area" value={newUserArea} onChange={e => setNewUserArea(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select onChange={e => setNewUserLocation(e.target.value.trimStart())} title="Location" className={newUserLocation === "" && "empty-select"}>
                  <option value="" selected={modalData?.location === ""} className='empty-select'></option>
                  <option value="SS" selected={modalData?.location === "SS"}>SS</option>
                  <option value="PB" selected={modalData?.location === "PB"}>PB</option>
                  <option value="1P" selected={modalData?.location === "1P"}>1P</option>
                  <option value="4P" selected={modalData?.location === "4P"}>4P</option>
                </select>
              </fieldset>
            </div> */}

            <div className="form-group">
              <fieldset>
                <legend>Comment</legend>
                <textarea spellCheck={false} rows="2" title="Comment" value={newUserComment} onChange={e => setNewUserComment(e.target.value.trimStart())} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>Cancel</button>
              <button className='mainModal__send'>Confirm</button>
            </div>
          </form>
        </>
      }

      {modalData?.userData && deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>DELETE CONTACT</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer deleteMode">
              {
                <button tabIndex={-1} disabled={resultDeleteContact.isLoading} className={`listPicker disabled`}>{modalData?.category === "personal" ? "Personal" : "Company"}</button>
              }
            </div>
          </div>
          <form className='mainModal__data__form deleteMode disabled' disabled={resultDeleteContact.isLoading}>
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Name" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend>E-Mail</legend>
                <input readOnly disabled spellCheck={false} type="text" title="E-Mail" value={modalData?.email || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Tel</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Tel" value={modalData?.tel || "-"} />
              </fieldset>
              <fieldset>
                <legend>Role</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Role" value={modalData?.role || "-"} />
              </fieldset>
            </div>

            {/*  <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Area" value={modalData?.area || "-"} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select readOnly disabled title="Location">
                  <option readOnly disabled value="" selected={modalData?.location === ""} >-</option>
                  <option readOnly disabled value="SS" selected={modalData?.location === "SS"}>SS</option>
                  <option readOnly disabled value="PB" selected={modalData?.location === "PB"}>PB</option>
                  <option readOnly disabled value="1P" selected={modalData?.location === "1P"}>1P</option>
                  <option readOnly disabled value="4P" selected={modalData?.location === "4P"}>4P</option>
                </select>
              </fieldset>
            </div> */}

            <div className="form-group">
              <fieldset>
                <legend>Comment</legend>
                <textarea readOnly disabled spellCheck={false} rows="2" title="Comment" value={modalData?.comment || "-"} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>Cancel</button>
              <button type='button' className='mainModal__send' onClick={() => deleteUserFn(modalData)}>Confirm</button>
            </div>
          </form>
        </>
      }

      {modalData?.newUser &&
        <>
          <div className="mainModal__titleContainer">
            <h2>ADD CONTACT</h2>
            <div className="listPickerWrapper__btnContainer">
              {
                <button disabled={resultAddContact.isLoading} className={`listPicker ${listPickerOpen && "selected"} ${resultAddContact.isLoading && "disabled"}`} onClick={() => listPickerOpen ? selectList(newUserCategory === "personal" ? "personal" : "company") : setListPickerOpen(true)}>{newUserCategory === "personal" ? "Personal" : "Company"}</button>
              }
              {
                listPickerOpen &&
                <div className="listPickerOptions">
                  <button className={`listPicker`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button className={`listPicker`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                </div>
              }
            </div>
          </div>
          <form className='mainModal__data__form' onSubmit={(e) => addUserFn(e)} disabled={resultAddContact.isLoading}>
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input spellCheck={false} type="text" title="Name" value={newUserName} onChange={e => setNewUserName(e.target.value.trimStart())} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend>E-Mail</legend>
                <input spellCheck={false} type="text" title="E-Mail" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value.trimStart())} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Tel</legend>
                <input spellCheck={false} type="tel" title="Tel" value={newUserTel} onChange={e => {
                  const value = e.target.value.replace(/\D/g, '').trimStart();
                  setNewUserTel(value)
                }} maxLength={20} />
              </fieldset>
              <fieldset>
                <legend>Role</legend>
                <input spellCheck={false} type="text" title="Role" value={newUserRole} onChange={e => setNewUserRole(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input spellCheck={false} type="text" title="Area" value={newUserArea} onChange={e => setNewUserArea(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select onChange={e => setNewUserLocation(e.target.value.trimStart())} title="Location" className={newUserLocation === "" && "empty-select"}>
                  <option value="Location" selected className='empty-select'></option>
                  <option value="SS">SS</option>
                  <option value="PB">PB</option>
                  <option value="1P">1P</option>
                  <option value="4P">4P</option>
                </select>
              </fieldset>
            </div> */}

            <div className="form-group">
              <fieldset>
                <legend>Comment</legend>
                <textarea spellCheck={false} rows="2" title="Comment" value={newUserComment} onChange={e => setNewUserComment(e.target.value.trimStart())} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send'>Send</button>
            </div>
          </form>
        </>
      }
    </>
  )
}
