import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setModal } from '../store/slices/modalSlice'
import { useAddTdlMutation, useDeleteTdlMutation, useEditTdlMutation } from '../store/slices/apiSlice'

export default function TDLDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)
  const [addTdl, resultAddTdl] = useAddTdlMutation()

  /* const textInput = useRef()
  const textInputEdit = useRef() */
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState("personal")
  const [newTaskPriority, setNewTaskPriority] = useState("medium")
  const [newTaskStatus, setNewTaskStatus] = useState("pending")

  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  const [deleteTdl, resultDeleteTdl] = useDeleteTdlMutation()
  const [editTdl, resultEditTdl] = useEditTdlMutation()

  const selectList = list => {
    setNewTaskCategory(list)
  }

  const trimInputs = () => {
    setNewTaskTitle(newTaskTitle => newTaskTitle.trim())
    setNewTaskDescription(newTaskDescription => newTaskDescription.trim())
  }

  const addTdlFn = async (e) => {
    e.preventDefault()

    if (resultAddTdl.isLoading) {
      return
    }
    if (newTaskTitle.trim() === "") {
      return
    }
    const task = {
      title: newTaskTitle,
      content: newTaskDescription,
      priority: newTaskPriority,
      status: newTaskStatus,
      category: newTaskCategory,
      localId: crypto.randomUUID(),
      localTime: Date.now()
    }

    dispatch(setModal({ active: false, data: {} }))
    await addTdl({ ...task, userId: modalData.userId, })

    /* timeout-refetch */
    /* setTimeout(() => {
      dispatch(setModal({ active: false, data: {} }))
    }, 400) */
  }

  const editModeFN = () => {
    setNewTaskCategory(modalData?.category)
    setNewTaskTitle(modalData?.title)
    setNewTaskDescription(modalData?.content)
    setNewTaskPriority(modalData?.priority)
    setNewTaskStatus(modalData?.status)
    setEditMode(true)
  }

  const editTaskFn = async (e, task) => {
    e.preventDefault()

    if (resultEditTdl.isLoading) {
      return
    }

    const input = newTaskDescription.trim()
    const title = newTaskTitle.trim()
    const category = newTaskCategory.trim()
    const priority = newTaskPriority.trim()
    const status = newTaskStatus.trim()

    if (title.trim() === "") {
      return
    }

    if (input.trim() === task.content && (task.title === (title ?? task.title)) && (task.priority === (priority ?? task.priority)) && (task.category === (category ?? task.category)) && (task.status === (status ?? task.status))) {
      dispatch(setModal({ active: false, data: {} }))
      return
    }

    const { modalType, tdlData, ...trimTask } = task

    const newTask = { ...trimTask, title: title ?? task.title, content: input.trim(), category: category ?? task.category, priority: priority ?? task.priority, status: status ?? task.status }

    dispatch(setModal({ active: false, data: {} }))
    await editTdl(newTask)

    /* timeout-refetch */
    /*  setTimeout(() => {
       dispatch(setModal({ active: false, data: {} }))
     }, 400) */
  }


  const deleteTdlFn = async (e, task) => {
    e.preventDefault()

    if (resultDeleteTdl.isLoading) {
      return
    }

    dispatch(setModal({ active: false, data: {} }))
    await deleteTdl(task)

    /* timeout-refetch */
    /*  setTimeout(() => {
       dispatch(setModal({ active: false, data: {} }))
     }, 400) */
  }

  const preventEnterSubmit = (e) => {
    if (e.key === "Enter" && e.target.className !== "mainModal__send" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (!modalActive) {
      setNewTaskTitle("")
      setNewTaskDescription("")
      setNewTaskPriority("medium")
      setNewTaskStatus("pending")
      setNewTaskCategory("personal")
      setEditMode(false)
      setDeleteMode(false)
    }
  }, [modalActive])


  return (
    <>
      {
        modalData?.tdlData && !editMode && !deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>TASK</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <button tabIndex={-1} className={`listPicker disabled selected`} >{modalData?.category === "company" ? "Company" : "Personal"}</button>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer disabled'>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>Priority:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {modalData?.priority}
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>Status:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected`}>
                  {modalData?.status}
                </button>
              </div>
            </div>
            <fieldset>
              <legend><label htmlFor="title">Title</label></legend>
              <textarea id="title" placeholder='Required' required readOnly disabled spellCheck={false} rows="1" className='taskOpenTitle' value={modalData?.title || "-"} />
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
        modalData?.tdlData && editMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>EDIT TASK</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer editMode">
              <div className="listPickerOptions">
                <button disabled={resultEditTdl.isLoading} className={`listPicker ${newTaskCategory === "personal" && "selected"} ${resultEditTdl.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  Personal
                </button>
                <button disabled={resultEditTdl.isLoading} className={`listPicker ${newTaskCategory === "company" && "selected"} ${resultEditTdl.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  Company
                </button>
              </div>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer editMode' disabled={resultEditTdl.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editTaskFn(e, modalData)}>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>Priority:&nbsp;</div>
                <button type='button' onClick={() => setNewTaskPriority("low")} className={`tdl-priority selectedLow ${newTaskPriority === "low" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  Low
                </button>
                <button type='button' onClick={() => setNewTaskPriority("medium")} className={`tdl-priority selectedMedium ${newTaskPriority === "medium" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  Medium
                </button>
                <button type='button' onClick={() => setNewTaskPriority("high")} className={`tdl-priority selectedHigh ${newTaskPriority === "high" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  High
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>Status:&nbsp;</div>
                <button type='button' onClick={() => setNewTaskStatus("pending")} className={`tdl-priority ${newTaskStatus === "pending" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}>
                  Pending
                </button>
                <button type='button' onClick={() => setNewTaskStatus("completed")} className={`tdl-priority ${newTaskStatus === "completed" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  Completed
                </button>
              </div>
            </div>
            <fieldset>
              <legend><label htmlFor="editTitle">Title</label></legend>
              <textarea id="editTitle" placeholder='Required' required spellCheck={false} rows="1" value={newTaskTitle} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTaskTitle(e.target.value) }} maxLength={200} className='taskOpenTitle' />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="editDescription">Description</label></legend>
              <textarea id="editDescription" spellCheck={false} rows="4" value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} maxLength={2000} className='taskOpenContent' />
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
        modalData?.tdlData && deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>DELETE TASK</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer deleteMode">
              <button tabIndex={-1} disabled={resultDeleteTdl.isLoading} className={`listPicker disabled selected`}>{modalData?.category === "personal" ? "Personal" : "Company"}</button>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer deleteMode disabled' onKeyDown={(e) => { preventEnterSubmit(e) }} disabled={resultDeleteTdl.isLoading} onSubmit={(e) => deleteTdlFn(e, modalData)}>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>Priority:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {modalData?.priority}
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>Status:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected`}>
                  {modalData?.status}
                </button>
              </div>
            </div>
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
        modalData?.newTask &&
        <>
          <div className="mainModal__titleContainer">
            <h2>ADD TASK</h2>
            <div className="listPickerWrapper__btnContainer">
              <div className="listPickerOptions">
                <button disabled={resultAddTdl.isLoading} className={`listPicker ${newTaskCategory === "personal" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  Personal
                </button>
                <button disabled={resultAddTdl.isLoading} className={`listPicker ${newTaskCategory === "company" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  Company
                </button>
              </div>
            </div>
          </div>
          <form autoCapitalize='off' disabled={resultAddTdl.isLoading} className='mainModal__data__form taskContainer' onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => addTdlFn(e)}>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>Priority:&nbsp;</div>
                <button type='button' onClick={() => setNewTaskPriority("low")} className={`tdl-priority selectedLow ${newTaskPriority === "low" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  Low
                </button>
                <button type='button' onClick={() => setNewTaskPriority("medium")} className={`tdl-priority selectedMedium ${newTaskPriority === "medium" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  Medium
                </button>
                <button type='button' onClick={() => setNewTaskPriority("high")} className={`tdl-priority selectedHigh ${newTaskPriority === "high" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  High
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>Status:&nbsp;</div>
                <button type='button' onClick={() => setNewTaskStatus("pending")} className={`tdl-priority ${newTaskStatus === "pending" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}>
                  Pending
                </button>
                <button type='button' onClick={() => setNewTaskStatus("completed")} className={`tdl-priority ${newTaskStatus === "completed" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  Completed
                </button>
              </div>
            </div>
            <fieldset>
              <legend><label htmlFor="addTitle">Title</label></legend>
              <textarea id="addTitle" placeholder='Required' required spellCheck={false} rows="1" value={newTaskTitle} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTaskTitle(e.target.value) }} maxLength={200} className='taskOpenTitle' />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="addDescription">Description</label></legend>
              <textarea id="addDescription" spellCheck={false} rows="4" value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} maxLength={2000} className='taskOpenContent' />
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
