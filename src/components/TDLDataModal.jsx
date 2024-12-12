import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setModal } from '../store/slices/modalSlice'
import { useAddTdlMutation, useDeleteTdlMutation, useEditTdlMutation } from '../store/slices/apiSlice'

export default function TDLDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)
  const [addTdl, resultAddTdl] = useAddTdlMutation()

  const textInput = useRef()
  const textInputEdit = useRef()
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState("medium")
  const [newTaskCategory, setNewTaskCategory] = useState("personal")
  const [newTaskStatus, setNewTaskStatus] = useState("not done")

  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  const [deleteTdl, resultDeleteTdl] = useDeleteTdlMutation()
  const [editTdl, resultEditTdl] = useEditTdlMutation()

  const selectList = list => {
    setNewTaskCategory(list)
  }

  const trimInputs = () => {
    setNewTaskTitle(newTaskTitle => newTaskTitle.trim())

    if (textInput.current) {
      textInput.current.textContent = textInput.current.textContent.trim()
    }
    if (textInputEdit.current) {
      textInputEdit.current.textContent = textInputEdit.current.textContent.trim()
    }
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
      content: textInput.current.textContent.trim(),
      priority: newTaskPriority,
      status: newTaskStatus,
      category: newTaskCategory
    }

    await addTdl({ ...task, userId: modalData.userId, })
    dispatch(setModal({ active: false, data: {} }))

    /* timeout-refetch */
    /* setTimeout(() => {
      dispatch(setModal({ active: false, data: {} }))
    }, 400) */
  }

  const editModeFN = () => {
    setNewTaskPriority(modalData?.priority)
    setNewTaskCategory(modalData?.category)
    setNewTaskStatus(modalData?.status)
    setNewTaskTitle(modalData?.title)
    setEditMode(true)
  }

  const editTaskFn = async (e, task) => {
    e.preventDefault()

    if (resultEditTdl.isLoading) {
      return
    }

    const input = textInputEdit.current.textContent.trim()
    const priority = newTaskPriority.trim()
    const category = newTaskCategory.trim()
    const status = newTaskStatus.trim()
    const title = newTaskTitle.trim()

    if (title.trim() === "") {
      return
    }

    if (input.trim() === task.content && (task.title === (title ?? task.title)) && (task.priority === (priority ?? task.priority)) && (task.category === (category ?? task.category)) && (task.status === (status ?? task.status))) {
      dispatch(setModal({ active: false, data: {} }))
      return
    }

    const { modalType, tdlData, ...trimTask } = task

    const newTask = { ...trimTask, title: title ?? task.title, content: input.trim(), category: category ?? task.category, priority: priority ?? task.priority, status: status ?? task.status }

    await editTdl(newTask)
    dispatch(setModal({ active: false, data: {} }))

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

    await deleteTdl(task)
    dispatch(setModal({ active: false, data: {} }))

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
      setNewTaskTitle("")
      setNewTaskPriority("medium")
      setNewTaskStatus("not done")
      setNewTaskCategory("personal")
      textInput.current.textContent = ""
      textInputEdit.current.textContent = ""
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
          <form className='mainModal__data__form taskContainer disabled'>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>Priority: </div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {modalData?.priority}
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>Status: </div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected`}>
                  {modalData?.status}
                </button>
              </div>
            </div>
            <fieldset>
              <legend>Title</legend>
              <input className='taskInputTitle' placeholder='Required' disabled spellCheck={false} type="text" value={modalData?.title || "-"} required />
            </fieldset>
            <fieldset>
              <legend>Description</legend>
              <div aria-label='textarea' className={`taskOpenContent`}>{modalData?.content || "-"}</div>
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
          <form className='mainModal__data__form taskContainer editMode' disabled={resultEditTdl.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editTaskFn(e, modalData)}>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>Priority: </div>
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
                <div>Status: </div>
                <button type='button' onClick={() => setNewTaskStatus("not done")} className={`tdl-priority ${newTaskStatus === "not done" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}>
                  Not Done
                </button>
                <button type='button' onClick={() => setNewTaskStatus("done")} className={`tdl-priority ${newTaskStatus === "done" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  Done
                </button>
              </div>
            </div>
            <fieldset>
              <legend>Title</legend>
              <input className='taskInputTitle' placeholder='Required' spellCheck={false} type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} maxLength={200} required />
            </fieldset>
            <fieldset>
              <legend>Description</legend>
              <div aria-label='textarea' className={`taskOpenContent ${resultAddTdl.isLoading && "disabled"}`} contentEditable={!resultEditTdl.isLoading} ref={textInputEdit} spellCheck={false}>{modalData?.content}</div>
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
          <form className='mainModal__data__form taskContainer deleteMode disabled' onKeyDown={(e) => { preventEnterSubmit(e) }} disabled={resultDeleteTdl.isLoading} onSubmit={(e) => deleteTdlFn(e, modalData)}>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>Priority: </div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {modalData?.priority}
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>Status: </div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected`}>
                  {modalData?.status}
                </button>
              </div>
            </div>
            <fieldset>
              <legend>Title</legend>
              <input className='taskInputTitle' placeholder='Required' disabled spellCheck={false} type="text" value={modalData?.title || "-"} required />
            </fieldset>
            <fieldset>
              <legend>Description</legend>
              <div aria-label='textarea' className={`taskOpenContent`}>{modalData?.content || "-"}</div>
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
          <form disabled={resultAddTdl.isLoading} className='mainModal__data__form taskContainer' onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => addTdlFn(e)}>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>Priority: </div>
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
                <div>Status: </div>
                <button type='button' onClick={() => setNewTaskStatus("not done")} className={`tdl-priority ${newTaskStatus === "not done" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}>
                  Not Done
                </button>
                <button type='button' onClick={() => setNewTaskStatus("done")} className={`tdl-priority ${newTaskStatus === "done" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  Done
                </button>
              </div>
            </div>
            <fieldset>
              <legend>Title</legend>
              <input className='taskInputTitle' placeholder='Required' spellCheck={false} type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} maxLength={200} required />
            </fieldset>
            <fieldset>
              <legend>Description</legend>
              <div aria-label='textarea' className={`taskOpenContent ${resultAddTdl.isLoading && "disabled"}`} contentEditable={!resultAddTdl.isLoading} ref={textInput} spellCheck={false} placeholder='Required'></div>
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
