import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setModal } from '../store/slices/modalSlice'
import { useAddSupportMutation, useDeleteSupportMutation, useEditSupportMutation } from '../store/slices/apiSlice'

export default function SupportDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)
  const [addSupport, resultAddSupport] = useAddSupportMutation()

  /*   const textInput = useRef()
    const textInputEdit = useRef() */
  const [newTicketTitle, setNewTicketTitle] = useState("")
  const [newTicketDescription, setNewTicketDescription] = useState("")
  const [newTicketCategory, setNewTicketCategory] = useState("personal")
  /*   const [newTaskPriority, setNewTaskPriority] = useState("medium")
    const [newTaskStatus, setNewTaskStatus] = useState("not done") */

  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  const [deleteSupport, resultDeleteSupport] = useDeleteSupportMutation()
  const [editSupport, resultEditSupport] = useEditSupportMutation()

  const selectList = list => {
    setNewTicketCategory(list)
  }

  const trimInputs = () => {
    setNewTicketTitle(newTicketName => newTicketName.trim())
    setNewTicketDescription(newTicketDescription => newTicketDescription.trim())
  }

  const addSupportFn = async (e) => {
    e.preventDefault()

    if (resultAddSupport.isLoading) {
      return
    }
    if (newTicketTitle.trim() === "") {
      return
    }
    const ticket = {
      title: newTicketTitle,
      category: newTicketCategory,
      content: newTicketDescription,
      localId: crypto.randomUUID(),
      localTime: Date.now()
      /*       priority: newTicketPriority,
            status: newTicketStatus, */
    }

    dispatch(setModal({ active: false, data: {} }))
    await addSupport({ ...ticket, userId: modalData.userId, })

    /* timeout-refetch */
    /* setTimeout(() => {
      dispatch(setModal({ active: false, data: {} }))
    }, 400) */
  }

  const editModeFN = () => {
    setNewTicketCategory(modalData?.category)
    setNewTicketTitle(modalData?.title)
    setNewTicketDescription(modalData?.content)
    /*  setNewTicketPriority(modalData?.priority)
     setNewTicketStatus(modalData?.status) */
    setEditMode(true)
  }

  const editTicketFn = async (e, ticket) => {
    e.preventDefault()

    if (resultEditSupport.isLoading) {
      return
    }

    const input = newTicketDescription.trim()
    const title = newTicketTitle.trim()
    const category = newTicketCategory.trim()

    /*    const priority = newTicketPriority.trim()
       const status = newTicketStatus.trim() */

    if (title.trim() === "") {
      return
    }

    if (input.trim() === ticket.content /* && (ticket.priority === (priority ?? ticket.priority)) */ && (ticket.category === (category ?? ticket.category)) && (ticket.title === (title ?? ticket.title)) /* && (ticket.status === (status ?? ticket.status)) */) {
      dispatch(setModal({ active: false, data: {} }))
      return
    }

    const { modalType, supportData, ...trimTicket } = ticket

    const newTicket = { ...trimTicket, title: title ?? ticket.title, content: input.trim(), category: category ?? ticket.category, /* priority: priority ?? ticket.priority, status: status ?? ticket.status */ }

    dispatch(setModal({ active: false, data: {} }))
    await editSupport(newTicket)

    /* timeout-refetch */
    /*  setTimeout(() => {
       dispatch(setModal({ active: false, data: {} }))
     }, 400) */
  }


  const deleteSupportFn = async (e, ticket) => {
    e.preventDefault()

    if (resultDeleteSupport.isLoading) {
      return
    }

    dispatch(setModal({ active: false, data: {} }))
    await deleteSupport(ticket)

    /* timeout-refetch */
    /*  setTimeout(() => {
       dispatch(setModal({ active: false, data: {} }))
     }, 400) */
  }

  const preventEnterSubmit = (e) => {
    if (e.key === "Enter" && e.target.className !== "mainModal__send" && e.target.tagName !== "TEXTAREA" && e.target.ariaLabel !== "textarea") {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (!modalActive) {
      /*  setNewTaskPriority("medium") */
      setNewTicketTitle("")
      setNewTicketDescription("")
      setNewTicketCategory("personal")
      setEditMode(false)
      setDeleteMode(false)
    }
  }, [modalActive])


  return (
    <>
      {
        modalData?.supportData && !editMode && !deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>TICKET</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <button tabIndex={-1} className={`listPicker disabled selected`} >{modalData?.category === "company" ? "Company" : "Personal"}</button>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer disabled'>
            {/*  <div className={`taskOpenData`}>
              <div>Priority: </div>
              <button tabIndex={-1} type='button' disabled className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                </svg>
                {modalData?.priority}
              </button>
            </div> */}
            {/*   <div className={`taskOpenData`}>
              <div>Status: </div>
              <button tabIndex={-1} type='button' disabled className={`tdl-priority selected`}>
                {modalData?.status}
              </button>
            </div> */}
            <fieldset>
              <legend><label htmlFor="title">Title</label></legend>
              <textarea id="deleteTitle" placeholder='Required' required readOnly disabled spellCheck={false} rows="1" className='taskOpenTitle' value={modalData?.title || "-"} />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="description">Description</label></legend>
              <textarea id="description" readOnly disabled spellCheck={false} rows="2" className='taskOpenContent' value={modalData?.content || "-"} />
            </fieldset>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => editModeFN()}>Edit</button>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(true)}>Delete</button>
            </div>
          </form>
        </>
      }
      {/* edit mode */}
      {
        modalData?.supportData && editMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>EDIT TICKET</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer editMode">
              <div className="listPickerOptions">
                <button disabled={resultEditSupport.isLoading} className={`listPicker ${newTicketCategory === "personal" && "selected"} ${resultEditSupport.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  Personal
                </button>
                <button disabled={resultEditSupport.isLoading} className={`listPicker ${newTicketCategory === "company" && "selected"} ${resultEditSupport.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  Company
                </button>
              </div>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer editMode' disabled={resultEditSupport.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editTicketFn(e, modalData)}>
            <fieldset>
              <legend><label htmlFor="editTitle">Title</label></legend>
              <textarea id="addTitle" placeholder='Required' required spellCheck={false} rows="1" value={newTicketTitle} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTicketTitle(e.target.value) }} maxLength={200} className='taskOpenTitle' />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="editDescription" onClick={() => textInputEdit.current.focus()}>Description</label></legend>
              <textarea id="editDescription" spellCheck={false} rows="4" value={newTicketDescription} onChange={e => setNewTicketDescription(e.target.value)} maxLength={2000} className='taskOpenContent' />

            </fieldset>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>Cancel</button>
              <button className='mainModal__send' onClick={trimInputs}>Confirm</button>
            </div>
          </form>
        </>
      }
      {/* delete mode */}
      {
        modalData?.supportData && deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>DELETE TICKET</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer deleteMode">
              <button tabIndex={-1} disabled={resultDeleteSupport.isLoading} className={`listPicker disabled selected`}>{modalData?.category === "personal" ? "Personal" : "Company"}</button>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer deleteMode disabled' onKeyDown={(e) => { preventEnterSubmit(e) }} disabled={resultDeleteSupport.isLoading} onSubmit={(e) => deleteSupportFn(e, modalData)}>
            <fieldset>
              <legend><label htmlFor="deleteTitle">Title</label></legend>
              <textarea id="deleteTitle" placeholder='Required' required readOnly disabled spellCheck={false} rows="1" className='taskOpenTitle' value={modalData?.title || "-"} />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="deleteDescription">Description</label></legend>
              <textarea id="deleteDescription" readOnly disabled spellCheck={false} rows="4" className='taskOpenContent' value={modalData?.content || "-"} />
            </fieldset>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>Cancel</button>
              <button className='mainModal__send' onClick={trimInputs}>Confirm</button>
            </div>
          </form>
        </>
      }
      {
        modalData?.newTicket &&
        <>
          <div className="mainModal__titleContainer">
            <h2>ADD TICKET</h2>
            <div className="listPickerWrapper__btnContainer">
              <div className="listPickerOptions">
                <button disabled={resultAddSupport.isLoading} className={`listPicker ${newTicketCategory === "personal" && "selected"} ${resultAddSupport.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  Personal
                </button>
                <button disabled={resultAddSupport.isLoading} className={`listPicker ${newTicketCategory === "company" && "selected"} ${resultAddSupport.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  Company
                </button>
              </div>
            </div>
          </div>
          <form autoCapitalize='off' disabled={resultAddSupport.isLoading} className='mainModal__data__form taskContainer' onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => addSupportFn(e)}>
            <fieldset>
              <legend><label htmlFor="addTitle">Title</label></legend>
              <textarea id="addTitle" placeholder='Required' required spellCheck={false} rows="1" value={newTicketTitle} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTicketTitle(e.target.value) }} maxLength={200} className='taskOpenTitle' />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="addDescription" onClick={() => textInput.current.focus()}>Description</label></legend>
              <textarea id="addDescription" spellCheck={false} rows="4" value={newTicketDescription} onChange={e => setNewTicketDescription(e.target.value)} maxLength={2000} className='taskOpenContent' />
            </fieldset>
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send' onClick={trimInputs}>Send</button>
            </div>
          </form>
        </>
      }
    </>
  )
}
