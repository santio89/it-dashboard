import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import { useAddContactMutation, useDeleteContactMutation, useEditContactMutation } from '../store/slices/apiSlice';
import { objectEquality } from '../utils/objectEquality';
import { useTranslation } from '../hooks/useTranslation'
import { toast } from "sonner";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseDb as db } from '../config/firebase';

export default function ContactsDataModal({ modalData }) {
  const lang = useTranslation()

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
  const [newUserComments, setNewUserComments] = useState("")
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
    setNewUserComments(newUserComments => newUserComments.trim())
    setNewUserCategory(newUserCategory => newUserCategory.trim())
  }

  const checkDuplicates = async (contact) => {
    const colRef = collection(db, "authUsersData", contact.userId, "contacts");
    const q = query(colRef, where("name", "==", contact.name));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty
  }

  const addUserFn = async (e) => {
    e.preventDefault()

    if (resultAddContact.isLoading) {
      return
    }

    if (newUserName === "") {
      return
    }

    /* if (modalData?.dataList?.find(contact => contact.name.toLowerCase() === newUserName.toLowerCase())) {
      setErrorMsg(lang.contactExists)
      return
    } */

    const newContact = {
      name: newUserName,
      email: newUserEmail,
      telephone: newUserTel,
      role: newUserRole,
      comments: newUserComments,
      category: newUserCategory,
      localId: crypto.randomUUID().replace(/-/g, ''),
      localTime: Date.now(),
      userId: modalData.userId
    }

    try {
      /* check for duplicates first */
      setErrorMsg(`${lang.checkingDuplicates}...`)
      const dups = await checkDuplicates(newContact)
      if (dups) {
        setErrorMsg(lang.contactExists)
        return
      }

      dispatch(setModal({ active: false, data: {} }))
      toast(`${lang.addingContact}...`)

      const res = await addContact(newContact)

      toast.message(lang.contactAdded, {
        description: `ID: ${res.data.id}`,
      });
    } catch (e) {
      toast(lang.errorPerformingRequest)
    }
  }

  const deleteUserFn = async (e, contact) => {
    e.preventDefault()

    if (resultDeleteContact.isLoading) {
      return
    }

    dispatch(setModal({ active: false, data: {} }))

    try {
      toast(`${lang.deletingContact}...`)
      const res = await deleteContact(contact)
      toast.message(lang.contactDeleted, {
        description: `ID: ${res.data.id}`,
      });
    } catch {
      toast(lang.errorPerformingRequest)
    }
  }

  const editModeFN = () => {
    setNewUserName(modalData?.name)
    setNewUserEmail(modalData?.email)
    setNewUserTel(modalData?.telephone)
    setNewUserRole(modalData?.role)
    setNewUserComments(modalData?.comments)
    setNewUserCategory(modalData?.category)
    setEditMode(true)
  }

  const editContactFn = async (e, contact) => {
    e.preventDefault()

    if (resultEditContact.isLoading) {
      return
    }

    if (newUserName === "") {
      return
    }

    /* if (contact.name !== newUserName && modalData?.dataList?.find(contact => contact.name.toLowerCase() === newUserName.toLowerCase())) {
      setErrorMsg(lang.contactExists)
      return
    } */

    const newContact = {
      name: newUserName,
      email: newUserEmail,
      telephone: newUserTel,
      role: newUserRole,
      comments: newUserComments,
      category: newUserCategory,
      id: contact.id,
      userId: contact.userId,
      localId: contact.localId,
      localTime: contact.localTime
    }

    const { modalType, contactData, createdAt, updatedAt, dataList, ...oldContact } = contact

    const contactEquality = objectEquality(oldContact, newContact)

    if (contactEquality) {
      /* return if equal */
      dispatch(setModal({ active: false, data: {} }))
      return
    } else {
      try {
        if (newContact.name !== oldContact.name) {
          /* check for duplicates */
          setErrorMsg(`${lang.checkingDuplicates}...`)
          const dups = await checkDuplicates(newContact)
          if (dups) {
            setErrorMsg(lang.contactExists)
            return
          }
        }

        dispatch(setModal({ active: false, data: {} }))
        toast(`${lang.editingContact}...`)

        const res = await editContact({ ...newContact, userId: modalData.userId })

        toast.message(lang.contactEdited, {
          description: `ID: ${res.data.id}`,
        });
      } catch {
        toast(lang.errorPerformingRequest)
      }

    }
  }

  const preventEnterSubmit = (e) => {
    if (e.key === "Enter" && e.target.className !== "mainModal__send" && e.target.tagName !== "TEXTAREA" && e.target.ariaLabel !== "textarea") {
      e.preventDefault()
    }
  }

  useEffect(() => {
    let timeout;
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
      setNewUserComments("")
      setNewUserCategory("personal")
      setEditMode(false)
      setDeleteMode(false)
      setErrorMsg(null)
    }
  }, [modalActive])

  return (
    <>
      {modalData?.contactData && !editMode && !deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.contact}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <button title={`${lang.category}: ${lang[modalData?.category]}`} tabIndex={-1} className={`listPicker disabled selected`}>{lang[modalData?.category]}</button>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form disabled'>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="name">{lang.name}</label></legend>
                <input id='name' placeholder={lang.required} readOnly disabled spellCheck={false} type="text" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="email">{lang.email}</label></legend>
                <input id='email' readOnly disabled spellCheck={false} type="text" value={modalData?.email || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="role">{lang.role}</label></legend>
                <input id='role' readOnly disabled spellCheck={false} type="text" value={modalData?.role || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="tel">{lang.telephone}</label></legend>
                <input id='tel' readOnly disabled spellCheck={false} type="tel" value={modalData?.telephone || "-"} />
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
                <legend><label htmlFor="comment">{lang.comments}</label></legend>
                <textarea id="comment" readOnly disabled spellCheck={false} rows="2" value={modalData?.comments || "-"} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => editModeFN()}>{lang.edit}</button>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(true)}>{lang.delete}</button>
            </div>
          </form>
        </>
      }

      {modalData?.contactData && editMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.editContact}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer editMode">
              <div className="listPickerOptions">
                <button title={`${lang.category}: ${lang.personal}`} disabled={resultEditContact.isLoading} className={`listPicker ${newUserCategory === "personal" && "selected"} ${resultEditContact.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  {lang.personal}
                </button>
                <button title={`${lang.category}: ${lang.company}`} disabled={resultEditContact.isLoading} className={`listPicker ${newUserCategory === "company" && "selected"} ${resultEditContact.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  {lang.company}
                </button>
              </div>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form editMode' disabled={resultEditContact.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editContactFn(e, modalData)} >
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="editName">{lang.name}</label></legend>
                <input id="editName" placeholder={lang.required} spellCheck={false} type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="editEmail">{lang.email}</label></legend>
                <input id="editEmail" spellCheck={false} type="text" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="editRole">{lang.role}</label></legend>
                <input id="editRole" spellCheck={false} type="text" value={newUserRole} onChange={e => setNewUserRole(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="editTel">{lang.telephone}</label></legend>
                <input id="editTel" spellCheck={false} type="tel" value={newUserTel} onChange={e => {
                  const value = e.target.value.replace(/\D/g, '');
                  setNewUserTel(value)
                }} maxLength={20} />
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
                <legend><label htmlFor="editComment">{lang.comments}</label></legend>
                <textarea id="editComment" spellCheck={false} rows="2" value={newUserComments} onChange={e => setNewUserComments(e.target.value)} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>{lang.cancel}</button>
              <button className='mainModal__send' onClick={trimInputs}>{lang.confirm}</button>
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
            <h2>{lang.deleteContact}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer deleteMode">
              <button title={`${lang.category}: ${lang[modalData?.category]}`} tabIndex={-1} className={`listPicker disabled selected`} disabled={resultDeleteContact.isLoading}>{lang[modalData?.category]}</button>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form deleteMode disabled' disabled={resultDeleteContact.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => deleteUserFn(e, modalData)} >
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="deleteName">{lang.name}</label></legend>
                <input id="deleteName" placeholder={lang.required} readOnly disabled spellCheck={false} type="text" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="deleteEmail">{lang.email}</label></legend>
                <input id="deleteEmail" readOnly disabled spellCheck={false} type="text" value={modalData?.email || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="deleteRole">{lang.role}</label></legend>
                <input id="deleteRole" readOnly disabled spellCheck={false} type="text" value={modalData?.role || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="deleteTel">{lang.telephone}</label></legend>
                <input id="deleteTel" readOnly disabled spellCheck={false} type="tel" value={modalData?.telephone || "-"} />
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
                <legend><label htmlFor="deleteComment">{lang.comments}</label></legend>
                <textarea id="deleteComment" readOnly disabled spellCheck={false} rows="2" value={modalData?.comments || "-"} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>{lang.cancel}</button>
              <button className='mainModal__send' onClick={trimInputs}>{lang.confirm}</button>
            </div>
          </form>
        </>
      }

      {modalData?.newContact &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.addContact}</h2>
            <div className="listPickerWrapper__btnContainer">
              <div className="listPickerOptions">
                <button title={`${lang.category}: ${lang.personal}`} disabled={resultAddContact.isLoading} className={`listPicker ${newUserCategory === "personal" && "selected"} ${resultAddContact.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  {lang.personal}
                </button>
                <button title={`${lang.category}: ${lang.company}`} disabled={resultAddContact.isLoading} className={`listPicker ${newUserCategory === "company" && "selected"} ${resultAddContact.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  {lang.company}
                </button>
              </div>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form' disabled={resultAddContact.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => { addUserFn(e) }}  >
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="addName">{lang.name}</label></legend>
                <input id="addName" placeholder={lang.required} spellCheck={false} type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="addEmail">{lang.email}</label></legend>
                <input id="addEmail" spellCheck={false} type="text" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="addRole">{lang.role}</label></legend>
                <input id="addRole" spellCheck={false} type="text" value={newUserRole} onChange={e => setNewUserRole(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="addTel">{lang.telephone}</label></legend>
                <input id="addTel" spellCheck={false} type="tel" value={newUserTel} onChange={e => {
                  const value = e.target.value.replace(/\D/g, '');
                  setNewUserTel(value)
                }} maxLength={20} />
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
                <legend><label htmlFor="addComment">{lang.comments}</label></legend>
                <textarea id="addComment" spellCheck={false} rows="2" value={newUserComments} onChange={e => setNewUserComments(e.target.value)} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send' onClick={trimInputs}>{lang.send}</button>
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
