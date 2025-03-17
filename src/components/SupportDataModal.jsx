import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setModal } from '../store/slices/modalSlice'
import { useAddSupportMutation, useDeleteSupportMutation, useEditSupportMutation } from '../store/slices/apiSlice'
import { useTranslation } from '../hooks/useTranslation'
import { toast } from 'sonner'

export default function SupportDataModal({ modalData }) {
  const lang = useTranslation()

  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)
  const [addSupport, resultAddSupport] = useAddSupportMutation()


  /*   const textInput = useRef()
    const textInputEdit = useRef() */
  const [newTicketTitle, setNewTicketTitle] = useState("")
  const [newTicketDescription, setNewTicketDescription] = useState("")
  const [newTicketCategory, setNewTicketCategory] = useState("personal")
  const [newTicketPriority, setNewTicketPriority] = useState("medium")
  const [newTicketStatus, setNewTicketStatus] = useState("pending")
  const [newTicketReply, setNewTicketReply] = useState("")

  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  const [showReply, setShowReply] = useState(true)

  const [deleteSupport, resultDeleteSupport] = useDeleteSupportMutation()
  const [editSupport, resultEditSupport] = useEditSupportMutation()


  const trimInputs = () => {
    setNewTicketTitle(newTicketName => newTicketName.trim())
    setNewTicketDescription(newTicketDescription => newTicketDescription.trim())
    setNewTicketReply(newTicketReply => newTicketReply.trim())
  }

  const addSupportFn = async (e) => {
    e.preventDefault()

    if (resultAddSupport.isLoading) {
      return
    }
    
    if (newTicketTitle === "") {
      return
    }

    const ticket = {
      title: newTicketTitle,
      category: newTicketCategory,
      content: newTicketDescription,
      localId: crypto.randomUUID().replace(/-/g, ''),
      localTime: Date.now(),
      priority: newTicketPriority,
      status: newTicketStatus,
      reply: newTicketStatus === "completed" ? (newTicketReply === "" ? lang.ticketClosed : newTicketReply) : "",
      author: modalData?.user.email,
      authorId: modalData?.user.uid
    }

    dispatch(setModal({ active: false, data: {} }))

    try {
      toast(`${lang.addingTicket}...`)
      const res = await addSupport({ ...ticket, userId: modalData.userId, })
      toast.message(lang.ticketAdded, {
        description: `ID: ${res.data.id}`,
      });
    } catch {
      toast(lang.errorPerformingRequest)
    }


    /* timeout-refetch */
    /* setTimeout(() => {
      dispatch(setModal({ active: false, data: {} }))
    }, 400) */
  }

  const deleteSupportFn = async (e, ticket) => {
    e.preventDefault()

    if (resultDeleteSupport.isLoading) {
      return
    }

    dispatch(setModal({ active: false, data: {} }))

    try {
      toast(`${lang.deletingTicket}...`)
      const res = await deleteSupport(ticket)
      toast.message(lang.ticketDeleted, {
        description: `ID: ${res.data.id}`,
      });
    } catch {
      toast(lang.errorPerformingRequest)
    }

    /* timeout-refetch */
    /*  setTimeout(() => {
       dispatch(setModal({ active: false, data: {} }))
     }, 400) */
  }

  const editModeFN = () => {
    setNewTicketCategory(modalData?.category)
    setNewTicketTitle(modalData?.title)
    setNewTicketDescription(modalData?.content)
    setNewTicketPriority(modalData?.priority)
    setNewTicketStatus(modalData?.status)
    setNewTicketReply(modalData?.reply)
    setEditMode(true)
  }

  const editTicketFn = async (e, ticket) => {
    e.preventDefault()

    if (resultEditSupport.isLoading) {
      return
    }
    if (newTicketTitle === "") {
      return
    }
    if (newTicketStatus === "completed" && newTicketReply === "") {
      setNewTicketReply(lang.ticketClosed)
    }

    const input = newTicketDescription
    const title = newTicketTitle
    const category = newTicketCategory
    const priority = newTicketPriority
    const status = newTicketStatus
    const reply = newTicketStatus === "completed" ? (newTicketReply === "" ? lang.ticketClosed : newTicketReply) : ""

    if (input === ticket.content && (ticket.priority === (priority ?? ticket.priority)) && (ticket.category === (category ?? ticket.category)) && (ticket.title === (title ?? ticket.title)) && (ticket.status === (status ?? ticket.status)) && (ticket.reply === (reply ?? ticket.reply))) {
      dispatch(setModal({ active: false, data: {} }))
      return
    }

    const { modalType, supportData, user, ...trimTicket } = ticket

    const newTicket = { ...trimTicket, title: title ?? ticket.title, content: input, category: category ?? ticket.category, priority: priority ?? ticket.priority, status: status ?? ticket.status, reply: reply ?? ticket.reply }

    dispatch(setModal({ active: false, data: {} }))

    try {
      toast(`${lang.editingTicket}...`)
      const res = await editSupport(newTicket)
      toast.message(lang.ticketEdited, {
        description: `ID: ${res.data.id}`,
      });
    } catch {
      toast(lang.errorPerformingRequest)
    }

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
      setNewTicketPriority("medium")
      setNewTicketStatus("pending")
      setNewTicketTitle("")
      setNewTicketDescription("")
      setNewTicketCategory("personal")
      setNewTicketReply("")
      setEditMode(false)
      setDeleteMode(false)
      setShowReply(true)
    }
  }, [modalActive])


  return (
    <>
      {
        modalData?.supportData && !editMode && !deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.ticket}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <button title={`${lang.author}: ${modalData?.author}`} tabIndex={-1} className={`listPicker disabled selected`}>{modalData?.author}</button>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer disabled'>
            <div className="taskOptions">
              {/* <div className={`taskOpenData`}>
                <div>Priority:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {modalData?.priority}
                </button>
              </div> */}
              <div className={`taskOpenData`}>
                <div>{lang.status}:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected`}>
                  {lang[modalData?.status]}
                </button>
              </div>
              {modalData?.status === "completed" && <button type='button' className={`replyBtn ${showReply && "active"}`} onClick={() => { setShowReply(showReply => !showReply) }}><span>▶</span><span>&nbsp;{lang.adminReply}</span></button>}
              {
                modalData?.status === "completed" && showReply &&
                <div className='taskReply'>
                  {modalData?.reply}
                </div>
              }
            </div>
            <fieldset>
              <legend><label htmlFor="title">{lang.title}</label></legend>
              <textarea id="deleteTitle" placeholder='Required' required readOnly disabled spellCheck={false} rows="1" className='taskOpenTitle' value={modalData?.title || "-"} />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="description">{lang.description}</label></legend>
              <textarea id="description" readOnly disabled spellCheck={false} rows="2" className='taskOpenContent' value={modalData?.content || "-"} />
            </fieldset>

            {modalData?.user.domainAdmin &&
              <div className='mainModal__btnContainer'>
                <button type='button' className='mainModal__send' onClick={() => editModeFN()}>{lang.edit}</button>
                <button type='button' className='mainModal__send' onClick={() => setDeleteMode(true)}>{lang.delete}</button>
              </div>
            }

          </form>
        </>
      }
      {/* edit mode */}
      {
        modalData?.supportData && editMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.editTicket}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer editMode">
              <button title={`${lang.author}: ${modalData?.author}`} tabIndex={-1} className={`listPicker disabled selected`}>{modalData?.author}</button>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer editMode' disabled={resultEditSupport.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editTicketFn(e, modalData)}>
            <div className="taskOptions">
              {/* <div className={`taskOpenData`}>
                <div>Priority:&nbsp;</div>
                <button type='button' onClick={() => setNewTicketPriority("low")} className={`tdl-priority selectedLow ${newTicketPriority === "low" && "selected"} ${resultAddSupport.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  Low
                </button>
                <button type='button' onClick={() => setNewTicketPriority("medium")} className={`tdl-priority selectedMedium ${newTicketPriority === "medium" && "selected"}  ${resultAddSupport.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  Medium
                </button>
                <button type='button' onClick={() => setNewTicketPriority("high")} className={`tdl-priority selectedHigh ${newTicketPriority === "high" && "selected"}  ${resultAddSupport.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  High
                </button>
              </div> */}
              <div className={`taskOpenData`}>
                <div>{lang.status}:&nbsp;</div>
                <button type='button' onClick={() => setNewTicketStatus("pending")} className={`tdl-priority ${newTicketStatus === "pending" && "selected"} ${resultAddSupport.isLoading && "disabled"}`}>
                  {lang.pending}
                </button>
                <button type='button' onClick={() => setNewTicketStatus("completed")} className={`tdl-priority ${newTicketStatus === "completed" && "selected"}  ${resultAddSupport.isLoading && "disabled"}`}>
                  {lang.completed}
                </button>
              </div>
              {newTicketStatus === "completed" && <button type='button' className={`replyBtn ${showReply && "active"}`} onClick={() => { setShowReply(showReply => !showReply) }}><span>▶</span><span>&nbsp;{lang.adminReply}</span></button>}
              {
                newTicketStatus === "completed" && showReply &&
                <div className='taskReply'>
                  <textarea id="addReply" placeholder={lang.ticketClosed} spellCheck={false} rows="1" value={newTicketReply} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTicketReply(e.target.value) }} maxLength={200} className='taskOpenTitle' />
                </div>
              }
            </div>
            <fieldset>
              <legend><label htmlFor="editTitle">{lang.title}</label></legend>
              <textarea id="editTitle" placeholder='Required' required spellCheck={false} rows="1" value={newTicketTitle} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTicketTitle(e.target.value) }} maxLength={200} className='taskOpenTitle' />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="editDescription">{lang.description}</label></legend>
              <textarea id="editDescription" spellCheck={false} rows="4" value={newTicketDescription} onChange={e => setNewTicketDescription(e.target.value)} maxLength={2000} className='taskOpenContent' />

            </fieldset>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>{lang.cancel}</button>
              <button className='mainModal__send' onClick={trimInputs}>{lang.confirm}</button>
            </div>
          </form>
        </>
      }
      {/* delete mode */}
      {
        modalData?.supportData && deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.deleteTicket}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer deleteMode">
              <button title={`${lang.author}: ${modalData?.author}`} tabIndex={-1} className={`listPicker disabled selected`}>{modalData?.author}</button>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer deleteMode disabled' onKeyDown={(e) => { preventEnterSubmit(e) }} disabled={resultDeleteSupport.isLoading} onSubmit={(e) => deleteSupportFn(e, modalData)}>
            <div className="taskOptions">
              {/* <div className={`taskOpenData`}>
                <div>Priority:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {modalData?.priority}
                </button>
              </div> */}
              <div className={`taskOpenData`}>
                <div>{lang.status}:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected`}>
                  {lang[modalData?.status]}
                </button>
              </div>
              {modalData?.status === "completed" && <button type='button' className={`replyBtn ${showReply && "active"}`} onClick={() => { setShowReply(showReply => !showReply) }}><span>▶</span><span>&nbsp;{lang.adminReply}</span></button>}
              {
                modalData?.status === "completed" && showReply &&
                <div className='taskReply'>
                  {modalData?.reply}
                </div>
              }
            </div>
            <fieldset>
              <legend><label htmlFor="deleteTitle">{lang.title}</label></legend>
              <textarea id="deleteTitle" placeholder='Required' required readOnly disabled spellCheck={false} rows="1" className='taskOpenTitle' value={modalData?.title || "-"} />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="deleteDescription">{lang.description}</label></legend>
              <textarea id="deleteDescription" readOnly disabled spellCheck={false} rows="4" className='taskOpenContent' value={modalData?.content || "-"} />
            </fieldset>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>{lang.cancel}</button>
              <button className='mainModal__send' onClick={trimInputs}>{lang.confirm}</button>
            </div>
          </form>
        </>
      }
      {
        modalData?.newTicket &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.addTicket}</h2>
            <div className="listPickerWrapper__btnContainer">
              <button title={`${lang.author}: ${modalData?.user.email}`} tabIndex={-1} className={`listPicker disabled selected`}>{modalData?.user.email}</button>
            </div>
          </div>
          <form autoCapitalize='off' disabled={resultAddSupport.isLoading} className='mainModal__data__form taskContainer' onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => addSupportFn(e)}>
            {modalData?.user.domainAdmin &&
              <div className="taskOptions">
                {/* <div className={`taskOpenData`}>
                  <div>Priority:&nbsp;</div>
                  <button type='button' onClick={() => setNewTicketPriority("low")} className={`tdl-priority selectedLow ${newTicketPriority === "low" && "selected"} ${resultAddSupport.isLoading && "disabled"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                    </svg>
                    Low
                  </button>
                  <button type='button' onClick={() => setNewTicketPriority("medium")} className={`tdl-priority selectedMedium ${newTicketPriority === "medium" && "selected"}  ${resultAddSupport.isLoading && "disabled"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                    </svg>
                    Medium
                  </button>
                  <button type='button' onClick={() => setNewTicketPriority("high")} className={`tdl-priority selectedHigh ${newTicketPriority === "high" && "selected"}  ${resultAddSupport.isLoading && "disabled"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                    </svg>
                    High
                  </button>
                </div> */}
                <div className={`taskOpenData`}>
                  <div>{lang.status}:&nbsp;</div>
                  <button type='button' onClick={() => setNewTicketStatus("pending")} className={`tdl-priority ${newTicketStatus === "pending" && "selected"} ${resultAddSupport.isLoading && "disabled"}`}>
                    {lang.pending}
                  </button>
                  <button type='button' onClick={() => setNewTicketStatus("completed")} className={`tdl-priority ${newTicketStatus === "completed" && "selected"}  ${resultAddSupport.isLoading && "disabled"}`}>
                    {lang.completed}
                  </button>
                </div>
                {newTicketStatus === "completed" && <button type='button' className={`replyBtn ${showReply && "active"}`} onClick={() => { setShowReply(showReply => !showReply) }}><span>▶</span><span>&nbsp;{lang.adminReply}</span></button>}
                {
                  newTicketStatus === "completed" && showReply &&
                  <div className='taskReply'>
                    <textarea id="addReply" placeholder={lang.ticketClosed} spellCheck={false} rows="1" value={newTicketReply} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTicketReply(e.target.value) }} maxLength={200} className='taskOpenTitle' />
                  </div>
                }
              </div>
            }
            <fieldset>
              <legend><label htmlFor="addTitle">{lang.title}</label></legend>
              <textarea id="addTitle" placeholder='Required' required spellCheck={false} rows="1" value={newTicketTitle} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTicketTitle(e.target.value) }} maxLength={200} className='taskOpenTitle' />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="addDescription">{lang.description}</label></legend>
              <textarea id="addDescription" spellCheck={false} rows="4" value={newTicketDescription} onChange={e => setNewTicketDescription(e.target.value)} maxLength={2000} className='taskOpenContent' />
            </fieldset>
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send' onClick={trimInputs}>{lang.send}</button>
            </div>
          </form>
        </>
      }
    </>
  )
}
