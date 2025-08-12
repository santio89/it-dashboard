import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { setModal } from '../store/slices/modalSlice'
import { useAddSupportMutation, useDeleteSupportMutation, useEditSupportMutation } from '../store/slices/apiSlice'
import { useTranslation } from '../hooks/useTranslation'
import { toast } from 'sonner'

export default function SupportDataModal({ modalData }) {
  const lang = useTranslation()

  const dispatch = useDispatch()
  const [addSupport, resultAddSupport] = useAddSupportMutation()

  const [newTicketTitle, setNewTicketTitle] = useState("")
  const [newTicketDescription, setNewTicketDescription] = useState("")
  const [newTicketCategory, setNewTicketCategory] = useState("personal")
  const [newTicketPriority, setNewTicketPriority] = useState("medium")
  const [newTicketStatus, setNewTicketStatus] = useState("pending")
  const [newTicketReply, setNewTicketReply] = useState("")
  const [newTicketAuthor, setNewTicketAuthor] = useState(modalData?.user.email || "")

  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  const [deleteSupport, resultDeleteSupport] = useDeleteSupportMutation()
  const [editSupport, resultEditSupport] = useEditSupportMutation()

  const [isLoading, setIsLoading] = useState(false)

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

    const newTicket = {
      author: newTicketAuthor,
      title: newTicketTitle,
      category: newTicketCategory,
      description: newTicketDescription,
      priority: newTicketPriority,
      status: newTicketStatus,
      reply: newTicketStatus === "completed" ? (newTicketReply === "" ? lang.ticketClosed : newTicketReply) : "",
      authorId: modalData?.user.uid,
      localId: crypto.randomUUID().replace(/-/g, ''),
      localTime: Date.now(),
      userId: modalData.user.uid,
      userEmail: modalData.user.email
    }

    dispatch(setModal({ active: false, data: {} }))

    try {
      toast(`${lang.addingTicket}...`)
      const res = await addSupport({ ...newTicket, userEmail: modalData.user.email, })
      toast.message(lang.ticketAdded, {
        description: `ID: ${res.data.id}`,
      });
    } catch {
      toast(lang.errorPerformingRequest)
    }
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
  }

  const editModeFN = () => {
    setNewTicketAuthor(modalData?.author)
    setNewTicketCategory(modalData?.category)
    setNewTicketTitle(modalData?.title)
    setNewTicketDescription(modalData?.description)
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

    const author = newTicketAuthor
    const input = newTicketDescription
    const title = newTicketTitle
    const category = newTicketCategory
    const priority = newTicketPriority
    const status = newTicketStatus
    const reply = newTicketStatus === "completed" ? (newTicketReply === "" ? lang.ticketClosed : newTicketReply) : ""

    if (input === ticket.description && (ticket.priority === (priority ?? ticket.priority)) && (ticket.category === (category ?? ticket.category)) && (ticket.title === (title ?? ticket.title)) && (ticket.status === (status ?? ticket.status)) && (ticket.reply === (reply ?? ticket.reply)) && (ticket.author === (author ?? ticket.author))) {
      dispatch(setModal({ active: false, data: {} }))
      return
    }

    const { modalType, supportData, user, ...trimTicket } = ticket

    const newTicket = { ...trimTicket, title: title ?? ticket.title, description: input ?? ticket.description, category: category ?? ticket.category, priority: priority ?? ticket.priority, status: status ?? ticket.status, reply: reply ?? ticket.reply, author: author ?? ticket.author }

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
  }

  const preventEnterSubmit = (e) => {
    if (e.key === "Enter" && e.target.className !== "mainModal__send" && e.target.tagName !== "TEXTAREA" && e.target.ariaLabel !== "textarea") {
      e.preventDefault()
    }
  }

  useEffect(() => {
    resultAddSupport.isLoading ? setIsLoading(true) : setIsLoading(false)
  }, [resultAddSupport])
  useEffect(() => {
    resultEditSupport.isLoading ? setIsLoading(true) : setIsLoading(false)
  }, [resultEditSupport])
  useEffect(() => {
    resultDeleteSupport.isLoading ? setIsLoading(true) : setIsLoading(false)
  }, [resultDeleteSupport])


  return (
    <>
      {
        !editMode && !deleteMode && !modalData?.new &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.ticket}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <input disabled form="modalForm" required placeholder={lang.author} title={`${lang.author}: ${modalData?.author}`} className={`listPicker disabled selected`} type="text" value={modalData?.author} autoCapitalize='off' autoComplete='off' spellCheck='false' />
            </div>
          </div>
          <form id="modalForm" autoCapitalize='off' autoComplete='off' spellCheck='false' className='mainModal__data__form taskContainer disabled'>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>{lang.priority}:&nbsp;</div>
                <button type='button' disabled className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang[modalData?.priority]}
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>{lang.status}:&nbsp;</div>
                <button type='button' disabled className={`tdl-priority selected ${modalData?.status === "pending" && "selectedLow"} ${modalData?.status === "completed" && "selectedMedium"}`}>
                  {modalData?.status === "pending" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
                  </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>}
                  {lang[modalData?.status]}
                </button>
              </div>
            </div>
            <fieldset>
              <legend><label htmlFor="title">{lang.title}</label></legend>
              <textarea id="deleteTitle" placeholder={lang.required} required readOnly disabled rows="1" className='taskOpenTitle' value={modalData?.title || "-"} />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="description">{lang.description}</label></legend>
              <textarea id="description" readOnly disabled rows="2" className='taskOpenContent' value={modalData?.description || "-"} />
            </fieldset>
            {
              modalData?.status === "completed" &&
              <fieldset>
                <legend><label htmlFor="reply">{lang.adminReply}</label></legend>
                <textarea id="reply" readOnly disabled rows="2" className='taskOpenContent reply' value={modalData?.reply || "-"} />
              </fieldset>
            }
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
        editMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.editTicket}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <input form="modalForm" required placeholder={lang.author} title={`${lang.author}: ${newTicketAuthor}`} disabled={!modalData?.user.domainAdmin} className={`listPicker selected editMode`} type="text" value={newTicketAuthor} onChange={e => setNewTicketAuthor(e.target.value)} autoCapitalize='off' autoComplete='off' spellCheck='false' />
            </div>
          </div>
          <form id="modalForm" autoCapitalize='off' autoComplete='off' spellCheck='false' className='mainModal__data__form taskContainer editMode' disabled={isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editTicketFn(e, modalData)}>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>{lang.priority}:&nbsp;</div>
                <button type='button' onClick={() => setNewTicketPriority("low")} className={`tdl-priority selectedLow ${newTicketPriority === "low" && "selected"} ${isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang.low}
                </button>
                <button type='button' onClick={() => setNewTicketPriority("medium")} className={`tdl-priority selectedMedium ${newTicketPriority === "medium" && "selected"}  ${isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang.medium}
                </button>
                <button type='button' onClick={() => setNewTicketPriority("high")} className={`tdl-priority selectedHigh ${newTicketPriority === "high" && "selected"}  ${isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang.high}
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>{lang.status}:&nbsp;</div>
                <button type='button' onClick={() => setNewTicketStatus("pending")} className={`tdl-priority selectedLow ${newTicketStatus === "pending" && "selected"} ${isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
                  </svg>
                  {lang.pending}
                </button>
                <button type='button' onClick={() => setNewTicketStatus("completed")} className={`tdl-priority selectedMedium ${newTicketStatus === "completed" && "selected"}  ${isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                  {lang.completed}
                </button>
              </div>
            </div>
            <fieldset>
              <legend><label htmlFor="editTitle">{lang.title}</label></legend>
              <textarea id="editTitle" placeholder={lang.required} required rows="1" value={newTicketTitle} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTicketTitle(e.target.value) }} maxLength={200} className='taskOpenTitle' />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="editDescription">{lang.description}</label></legend>
              <textarea id="editDescription" rows="2" value={newTicketDescription} onChange={e => setNewTicketDescription(e.target.value)} maxLength={2000} className='taskOpenContent' />
            </fieldset>
            {
              newTicketStatus === "completed" &&
              <fieldset>
                <legend><label htmlFor="reply">{lang.adminReply}</label></legend>
                <textarea id="reply" placeholder={lang.ticketClosed} rows="2" className='taskOpenContent reply' value={newTicketReply} onChange={e => { setNewTicketReply(e.target.value) }} maxLength={200} />
              </fieldset>
            }
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>{lang.cancel}</button>
              <button className='mainModal__send' onClick={trimInputs}>{lang.confirm}</button>
            </div>
          </form>
        </>
      }
      {/* delete mode */}
      {
        deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.deleteTicket}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <input disabled form="modalForm" required placeholder={lang.author} title={`${lang.author}: ${modalData?.author}`} className={`listPicker disabled selected deleteMode`} type="text" value={modalData?.author} autoCapitalize='off' autoComplete='off' spellCheck='false' />
            </div>
          </div>
          <form id="modalForm" autoCapitalize='off' autoComplete='off' spellCheck='false' className='mainModal__data__form taskContainer deleteMode disabled' onKeyDown={(e) => { preventEnterSubmit(e) }} disabled={isLoading} onSubmit={(e) => deleteSupportFn(e, modalData)}>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>{lang.priority}:&nbsp;</div>
                <button type='button' disabled className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang[modalData?.priority]}
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>{lang.status}:&nbsp;</div>
                <button type='button' disabled className={`tdl-priority selected ${modalData?.status === "pending" && "selectedLow"} ${modalData?.status === "completed" && "selectedMedium"}`}>
                  {modalData?.status === "pending" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
                  </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>}
                  {lang[modalData?.status]}
                </button>
              </div>
            </div>
            <fieldset>
              <legend><label htmlFor="deleteTitle">{lang.title}</label></legend>
              <textarea id="deleteTitle" placeholder={lang.required} required readOnly disabled rows="1" className='taskOpenTitle' value={modalData?.title || "-"} />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="deleteDescription">{lang.description}</label></legend>
              <textarea id="deleteDescription" readOnly disabled rows="2" className='taskOpenContent' value={modalData?.description || "-"} />
            </fieldset>
            {
              modalData?.status === "completed" &&
              <fieldset>
                <legend><label htmlFor="reply">{lang.adminReply}</label></legend>
                <textarea id="reply" readOnly disabled rows="2" className='taskOpenContent reply' value={modalData?.reply} />
              </fieldset>
            }
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>{lang.cancel}</button>
              <button className='mainModal__send' onClick={trimInputs}>{lang.confirm}</button>
            </div>
          </form>
        </>
      }
      {
        modalData?.new &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.addTicket}</h2>
            <div className="listPickerWrapper__btnContainer">
              <input form="modalForm" required placeholder={lang.author} title={`${lang.author}: ${newTicketAuthor}`} disabled={!modalData?.user.domainAdmin} className={`listPicker selected ${!modalData?.user.domainAdmin && "disabled"}`} type="text" value={newTicketAuthor} onChange={e => setNewTicketAuthor(e.target.value)} autoCapitalize='off' autoComplete='off' spellCheck='false' />
            </div>
          </div>
          <form id="modalForm" autoCapitalize='off' autoComplete='off' spellCheck='false' disabled={isLoading} className='mainModal__data__form taskContainer' onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => addSupportFn(e)}>
            {modalData?.user.domainAdmin &&
              <div className="taskOptions">
                <div className={`taskOpenData`}>
                  <div>{lang.priority}:&nbsp;</div>
                  <button type='button' onClick={() => setNewTicketPriority("low")} className={`tdl-priority selectedLow ${newTicketPriority === "low" && "selected"} ${isLoading && "disabled"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                    </svg>
                    {lang.low}
                  </button>
                  <button type='button' onClick={() => setNewTicketPriority("medium")} className={`tdl-priority selectedMedium ${newTicketPriority === "medium" && "selected"}  ${isLoading && "disabled"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                    </svg>
                    {lang.medium}
                  </button>
                  <button type='button' onClick={() => setNewTicketPriority("high")} className={`tdl-priority selectedHigh ${newTicketPriority === "high" && "selected"}  ${isLoading && "disabled"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                    </svg>
                    {lang.high}
                  </button>
                </div>
                <div className={`taskOpenData`}>
                  <div>{lang.status}:&nbsp;</div>
                  <button type='button' onClick={() => setNewTicketStatus("pending")} className={`tdl-priority selectedLow ${newTicketStatus === "pending" && "selected"} ${isLoading && "disabled"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
                    </svg>
                    {lang.pending}
                  </button>
                  <button type='button' onClick={() => setNewTicketStatus("completed")} className={`tdl-priority selectedMedium ${newTicketStatus === "completed" && "selected"}  ${isLoading && "disabled"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    {lang.completed}
                  </button>
                </div>
              </div>
            }
            <fieldset>
              <legend><label htmlFor="addTitle">{lang.title}</label></legend>
              <textarea id="addTitle" placeholder={lang.required} required rows="1" value={newTicketTitle} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTicketTitle(e.target.value) }} maxLength={200} className='taskOpenTitle' />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="addDescription">{lang.description}</label></legend>
              <textarea id="addDescription" rows="2" value={newTicketDescription} onChange={e => setNewTicketDescription(e.target.value)} maxLength={2000} className='taskOpenContent' />
            </fieldset>
            {
              newTicketStatus === "completed" &&
              <fieldset>
                <legend><label htmlFor="reply">{lang.adminReply}</label></legend>
                <textarea id="reply" placeholder={lang.ticketClosed} rows="2" className='taskOpenContent reply' value={newTicketReply} onChange={e => { setNewTicketReply(e.target.value) }} maxLength={200} />
              </fieldset>
            }
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send' onClick={trimInputs}>{lang.send}</button>
            </div>
          </form>
        </>
      }
    </>
  )
}
