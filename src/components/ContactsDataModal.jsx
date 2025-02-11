import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import { useAddContactMutation, useDeleteContactMutation, useEditContactMutation } from '../store/slices/apiSlice';
import { objectEquality } from '../utils/objectEquality';

export default function ContactsDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)

  const [addContact, resultAddContact] = useAddContactMutation()
  const [deleteContact, resultDeleteContact] = useDeleteContactMutation()
  const [editContact, resultEditContact] = useEditContactMutation()

  const [errorMsg, setErrorMsg] = useState(null)

  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserTel, setNewUserTel] = useState("")
  const [newUserRole, setNewUserRole] = useState("")
  const [newUserComment, setNewUserComment] = useState("")
  const [newUserCategory, setNewUserCategory] = useState("personal")

  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  const selectList = list => {
    setNewUserCategory(list)
  }

  const trimInputs = () => {
    setNewUserName(newUserName => newUserName.trim())
    setNewUserEmail(newUserEmail => newUserEmail.trim())
    setNewUserTel(newUserTel => newUserTel.trim())
    setNewUserRole(newUserRole => newUserRole.trim())
    setNewUserComment(newUserComment => newUserComment.trim())
    setNewUserCategory(newUserCategory => newUserCategory.trim())
  }

  const addUserFn = async (e) => {
    e.preventDefault()

    if (resultAddContact.isLoading) {
      return
    }

    if (newUserName === "") {
      return
    }

    if (modalData?.dataList?.find(contact => contact.name.toLowerCase() === newUserName.toLowerCase())) {
      setErrorMsg("Contact already exists")
      return
    }

    const user = {
      name: newUserName,
      email: newUserEmail,
      tel: newUserTel,
      role: newUserRole,
      comment: newUserComment,
      category: newUserCategory,
      localId: crypto.randomUUID(),
      localTime: Date.now()
    }

    dispatch(setModal({ active: false, data: {} }))
    await addContact({ ...user, userId: modalData.userId })
  }

  const deleteUserFn = async (e, contact) => {
    e.preventDefault()

    if (resultDeleteContact.isLoading) {
      return
    }

    dispatch(setModal({ active: false, data: {} }))
    await deleteContact(contact)
  }

  const editModeFN = () => {
    setNewUserName(modalData?.name)
    setNewUserEmail(modalData?.email)
    setNewUserTel(modalData?.tel)
    setNewUserRole(modalData?.role)
    setNewUserComment(modalData?.comment)
    setNewUserCategory(modalData?.category)
    setEditMode(true)
  }

  const editUserFn = async (e, contact) => {
    e.preventDefault()

    if (resultEditContact.isLoading) {
      return
    }

    if (newUserName === "") {
      return
    }

    if (contact.name !== newUserName && modalData?.dataList?.find(contact => contact.name.toLowerCase() === newUserName.toLowerCase())) {
      setErrorMsg("Contact already exists")
      return
    }

    const newUser = {
      name: newUserName,
      email: newUserEmail,
      tel: newUserTel,
      role: newUserRole,
      comment: newUserComment,
      category: newUserCategory,
      id: contact.id,
      userId: contact.userId,
      localId: contact.localId,
      localTime: contact.localTime
    }

    const { modalType, contactData, createdAt, updatedAt, dataList, ...oldUser } = contact

    const contactEquality = objectEquality(oldUser, newUser)

    if (contactEquality) {
      dispatch(setModal({ active: false, data: {} }))
      return
    } else {
      dispatch(setModal({ active: false, data: {} }))
      await editContact({ ...newUser, userId: modalData.userId })
    }
  }

  const preventEnterSubmit = (e) => {
    if (e.key === "Enter" && e.target.className !== "mainModal__send" && e.target.tagName !== "TEXTAREA" && e.target.ariaLabel !== "textarea") {
      e.preventDefault()
    }
  }

  useEffect(() => {
    let timeout;
    console.log(errorMsg)
    if (errorMsg) {
      timeout = setTimeout(() => {
        setErrorMsg(null)
      }, 4000)
    }

    return () => {
      clearTimeout(timeout)
    }

  }, [errorMsg])

  useEffect(() => {
    if (!modalActive) {
      setNewUserName("")
      setNewUserEmail("")
      setNewUserTel("")
      setNewUserRole("")
      setNewUserComment("")
      setNewUserCategory("personal")
      setEditMode(false)
      setDeleteMode(false)
    }
  }, [modalActive])

  return (
    <>
      {modalData?.contactData && !editMode && !deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>CONTACT</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <button tabIndex={-1} className={`listPicker disabled selected`} >{modalData?.category === "company" ? "Company" : "Personal"}</button>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form disabled'>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="name">Name</label></legend>
                <input id='name' placeholder='Required' readOnly disabled spellCheck={false} type="text" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="email">E-Mail</label></legend>
                <input id='email' readOnly disabled spellCheck={false} type="text" value={modalData?.email || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="tel">Tel</label></legend>
                <input id='tel' readOnly disabled spellCheck={false} type="tel" value={modalData?.tel || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="role">Role</label></legend>
                <input id='role' readOnly disabled spellCheck={false} type="text" value={modalData?.role || "-"} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.area || "-"} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select readOnly disabled>
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
                <legend><label htmlFor="comment">Comment</label></legend>
                <textarea id="comment" readOnly disabled spellCheck={false} rows="2" value={modalData?.comment || "-"} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => editModeFN()}>Edit</button>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(true)}>Delete</button>
            </div>
          </form>
        </>
      }

      {modalData?.contactData && editMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>EDIT CONTACT</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer editMode">
              <div className="listPickerOptions">
                <button disabled={resultEditContact.isLoading} className={`listPicker ${newUserCategory === "personal" && "selected"} ${resultEditContact.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  Personal
                </button>
                <button disabled={resultEditContact.isLoading} className={`listPicker ${newUserCategory === "company" && "selected"} ${resultEditContact.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  Company
                </button>
              </div>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form editMode' disabled={resultEditContact.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editUserFn(e, modalData)} >
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="editName">Name</label></legend>
                <input id="editName" placeholder='Required' spellCheck={false} type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="editEmail">E-Mail</label></legend>
                <input id="editEmail" spellCheck={false} type="text" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="editTel">Tel</label></legend>
                <input id="editTel" spellCheck={false} type="tel" value={newUserTel} onChange={e => {
                  const value = e.target.value.replace(/\D/g, '');
                  setNewUserTel(value)
                }} maxLength={20} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="editRole">Role</label></legend>
                <input id="editRole" spellCheck={false} type="text" value={newUserRole} onChange={e => setNewUserRole(e.target.value)} maxLength={200} />
              </fieldset>
            </div>

            {/*     <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input spellCheck={false} type="text" value={newUserArea} onChange={e => setNewUserArea(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select onChange={e => setNewUserLocation(e.target.value)} className={newUserLocation === "" && "empty-select"}>
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
                <legend><label htmlFor="editComment">Comment</label></legend>
                <textarea id="editComment" spellCheck={false} rows="2" value={newUserComment} onChange={e => setNewUserComment(e.target.value)} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>Cancel</button>
              <button className='mainModal__send' onClick={trimInputs}>Confirm</button>
            </div>
            {
              errorMsg &&
              <div className="mainModal__error">{errorMsg}</div>
            }
          </form>
        </>
      }

      {modalData?.contactData && deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>DELETE CONTACT</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer deleteMode">
              <button tabIndex={-1} disabled={resultDeleteContact.isLoading} className={`listPicker disabled selected`}>{modalData?.category === "personal" ? "Personal" : "Company"}</button>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form deleteMode disabled' disabled={resultDeleteContact.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => deleteUserFn(e, modalData)} >
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="deleteName">Name</label></legend>
                <input id="deleteName" placeholder='Required' readOnly disabled spellCheck={false} type="text" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="deleteEmail">E-Mail</label></legend>
                <input id="deleteEmail" readOnly disabled spellCheck={false} type="text" value={modalData?.email || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="deleteTel">Tel</label></legend>
                <input id="deleteTel" readOnly disabled spellCheck={false} type="tel" value={modalData?.tel || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="deleteRole">Role</label></legend>
                <input id="deleteRole" readOnly disabled spellCheck={false} type="text" value={modalData?.role || "-"} />
              </fieldset>
            </div>

            {/*  <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.area || "-"} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select readOnly disabled>
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
                <legend><label htmlFor="deleteComment">Comment</label></legend>
                <textarea id="deleteComment" readOnly disabled spellCheck={false} rows="2" value={modalData?.comment || "-"} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>Cancel</button>
              <button className='mainModal__send' onClick={trimInputs}>Confirm</button>
            </div>
          </form>
        </>
      }

      {modalData?.newUser &&
        <>
          <div className="mainModal__titleContainer">
            <h2>ADD CONTACT</h2>
            <div className="listPickerWrapper__btnContainer">
              <div className="listPickerOptions">
                <button disabled={resultAddContact.isLoading} className={`listPicker ${newUserCategory === "personal" && "selected"} ${resultAddContact.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  Personal
                </button>
                <button disabled={resultAddContact.isLoading} className={`listPicker ${newUserCategory === "company" && "selected"} ${resultAddContact.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  Company
                </button>
              </div>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form' disabled={resultAddContact.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => { addUserFn(e) }}  >
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="addName">Name</label></legend>
                <input id="addName" placeholder='Required' spellCheck={false} type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="addEmail">E-Mail</label></legend>
                <input id="addEmail" spellCheck={false} type="text" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="addTel">Tel</label></legend>
                <input id="addTel" spellCheck={false} type="tel" value={newUserTel} onChange={e => {
                  const value = e.target.value.replace(/\D/g, '');
                  setNewUserTel(value)
                }} maxLength={20} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="addRole">Role</label></legend>
                <input id="addRole" spellCheck={false} type="text" value={newUserRole} onChange={e => setNewUserRole(e.target.value)} maxLength={200} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input spellCheck={false} type="text" value={newUserArea} onChange={e => setNewUserArea(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select onChange={e => setNewUserLocation(e.target.value)} className={newUserLocation === "" && "empty-select"}>
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
                <legend><label htmlFor="addComment">Comment</label></legend>
                <textarea id="addComment" spellCheck={false} rows="2" value={newUserComment} onChange={e => setNewUserComment(e.target.value)} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send' onClick={trimInputs}>Send</button>
            </div>
            {
              errorMsg &&
              <div className="mainModal__error">{errorMsg}</div>
            }
          </form>
        </>
      }
    </>
  )
}
