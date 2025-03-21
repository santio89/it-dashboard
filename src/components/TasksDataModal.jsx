import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setModal } from '../store/slices/modalSlice'
import { useAddTdlMutation, useDeleteTdlMutation, useEditTdlMutation } from '../store/slices/apiSlice'
import { useTranslation } from '../hooks/useTranslation'
import { toast } from 'sonner'

export default function TasksDataModal({ modalData }) {
  const lang = useTranslation()

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

  const trimInputs = () => {
    setNewTaskTitle(newTaskTitle => newTaskTitle.trim())
    setNewTaskDescription(newTaskDescription => newTaskDescription.trim())
  }

  const addTdlFn = async (e) => {
    e.preventDefault()

    if (resultAddTdl.isLoading) {
      return
    }

    if (newTaskTitle === "") {
      return
    }

    const task = {
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority,
      status: newTaskStatus,
      category: newTaskCategory,
      author: modalData?.user.email,
      authorId: modalData?.user.uid,
      localId: crypto.randomUUID().replace(/-/g, ''),
      localTime: Date.now(),
    }

    dispatch(setModal({ active: false, data: {} }))

    try {
      toast(`${lang.addingTask}...`)
      const res = await addTdl({ ...task, userId: modalData.userId, })
      toast.message(lang.taskAdded, {
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

  const deleteTdlFn = async (e, task) => {
    e.preventDefault()

    if (resultDeleteTdl.isLoading) {
      return
    }

    dispatch(setModal({ active: false, data: {} }))

    try {
      toast(`${lang.deletingTask}...`)
      await deleteTdl(task)
      toast.message(lang.taskDeleted, {
        description: `ID: ${task.id}`,
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
    setNewTaskCategory(modalData?.category)
    setNewTaskTitle(modalData?.title)
    setNewTaskDescription(modalData?.description)
    setNewTaskPriority(modalData?.priority)
    setNewTaskStatus(modalData?.status)
    setEditMode(true)
  }

  const editTaskFn = async (e, task) => {
    e.preventDefault()

    if (resultEditTdl.isLoading) {
      return
    }

    const input = newTaskDescription
    const title = newTaskTitle
    const category = newTaskCategory
    const priority = newTaskPriority
    const status = newTaskStatus

    if (title === "") {
      return
    }

    if (input === task.description && (task.title === (title ?? task.title)) && (task.priority === (priority ?? task.priority)) && (task.category === (category ?? task.category)) && (task.status === (status ?? task.status))) {
      dispatch(setModal({ active: false, data: {} }))
      return
    }

    const { modalType, tasksData, ...trimTask } = task

    const newTask = { ...trimTask, title: title ?? task.title, description: input, category: category ?? task.category, priority: priority ?? task.priority, status: status ?? task.status }

    dispatch(setModal({ active: false, data: {} }))

    try {
      toast(`${lang.editingTask}...`)
      const res = await editTdl(newTask)
      toast.message(lang.taskEdited, {
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
        modalData?.tasksData && !editMode && !deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.task}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <button title={`${lang.author}: ${modalData?.author}`} tabIndex={-1} className={`listPicker disabled selected`}>{modalData?.author}</button>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer disabled'>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>{lang.priority}:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang[modalData?.priority]}
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>{lang.status}:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected`}>
                  {lang[modalData?.status]}
                </button>
              </div>
            </div>
            <fieldset>
              <legend><label htmlFor="title">{lang.title}</label></legend>
              <textarea id="title" placeholder={lang.required} required readOnly disabled spellCheck={false} rows="1" className='taskOpenTitle' value={modalData?.title || "-"} />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="description">{lang.description}</label></legend>
              <textarea id="description" readOnly disabled spellCheck={false} rows="2" className='taskOpenContent' value={modalData?.description || "-"} />
            </fieldset>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => editModeFN()}>{lang.edit}</button>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(true)}>{lang.delete}</button>
            </div>
          </form>
        </>
      }
      {/* edit mode */}
      {
        modalData?.tasksData && editMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.editTask}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer editMode">
              <button title={`${lang.author}: ${modalData?.author}`} tabIndex={-1} className={`listPicker disabled selected`}>{modalData?.author}</button>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer editMode' disabled={resultEditTdl.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editTaskFn(e, modalData)}>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>{lang.priority}:&nbsp;</div>
                <button type='button' onClick={() => setNewTaskPriority("low")} className={`tdl-priority selectedLow ${newTaskPriority === "low" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang.low}
                </button>
                <button type='button' onClick={() => setNewTaskPriority("medium")} className={`tdl-priority selectedMedium ${newTaskPriority === "medium" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang.medium}
                </button>
                <button type='button' onClick={() => setNewTaskPriority("high")} className={`tdl-priority selectedHigh ${newTaskPriority === "high" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang.high}
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>{lang.status}:&nbsp;</div>
                <button type='button' onClick={() => setNewTaskStatus("pending")} className={`tdl-priority ${newTaskStatus === "pending" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}>
                  {lang.pending}
                </button>
                <button type='button' onClick={() => setNewTaskStatus("completed")} className={`tdl-priority ${newTaskStatus === "completed" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  {lang.completed}
                </button>
              </div>
            </div>
            <fieldset>
              <legend><label htmlFor="editTitle">{lang.title}</label></legend>
              <textarea id="editTitle" placeholder={lang.required} required spellCheck={false} rows="1" value={newTaskTitle} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTaskTitle(e.target.value) }} maxLength={200} className='taskOpenTitle' />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="editDescription">{lang.description}</label></legend>
              <textarea id="editDescription" spellCheck={false} rows="4" value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} maxLength={2000} className='taskOpenContent' />
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
        modalData?.tasksData && deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.deleteTask}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer deleteMode">
              <button title={`${lang.author}: ${modalData?.author}`} tabIndex={-1} className={`listPicker disabled selected`}>{modalData?.author}</button>
            </div>
          </div>
          <form autoCapitalize='off' className='mainModal__data__form taskContainer deleteMode disabled' onKeyDown={(e) => { preventEnterSubmit(e) }} disabled={resultDeleteTdl.isLoading} onSubmit={(e) => deleteTdlFn(e, modalData)}>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>{lang.priority}:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang[modalData?.priority]}
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>{lang.status}:&nbsp;</div>
                <button tabIndex={-1} type='button' disabled className={`tdl-priority selected`}>
                  {lang[modalData?.status]}
                </button>
              </div>
            </div>
            <fieldset>
              <legend><label htmlFor="deleteTitle">{lang.title}</label></legend>
              <textarea id="deleteTitle" placeholder={lang.required} required readOnly disabled spellCheck={false} rows="1" className='taskOpenTitle' value={modalData?.title || "-"} />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="deleteDescription">{lang.description}</label></legend>
              <textarea id="deleteDescription" readOnly disabled spellCheck={false} rows="4" className='taskOpenContent' value={modalData?.description || "-"} />
            </fieldset>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>{lang.cancel}</button>
              <button className='mainModal__send' onClick={trimInputs}>{lang.confirm}</button>
            </div>
          </form>
        </>
      }
      {
        modalData?.newTask &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.addTask}</h2>
            <div className="listPickerWrapper__btnContainer">
              <button title={`${lang.author}: ${modalData?.user.email}`} tabIndex={-1} className={`listPicker disabled selected`}>{modalData?.user.email}</button>
            </div>
          </div>
          <form autoCapitalize='off' disabled={resultAddTdl.isLoading} className='mainModal__data__form taskContainer' onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => addTdlFn(e)}>
            <div className="taskOptions">
              <div className={`taskOpenData`}>
                <div>{lang.priority}:&nbsp;</div>
                <button type='button' onClick={() => setNewTaskPriority("low")} className={`tdl-priority selectedLow ${newTaskPriority === "low" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang.low}
                </button>
                <button type='button' onClick={() => setNewTaskPriority("medium")} className={`tdl-priority selectedMedium ${newTaskPriority === "medium" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang.medium}
                </button>
                <button type='button' onClick={() => setNewTaskPriority("high")} className={`tdl-priority selectedHigh ${newTaskPriority === "high" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  {lang.high}
                </button>
              </div>
              <div className={`taskOpenData`}>
                <div>{lang.status}:&nbsp;</div>
                <button type='button' onClick={() => setNewTaskStatus("pending")} className={`tdl-priority ${newTaskStatus === "pending" && "selected"} ${resultAddTdl.isLoading && "disabled"}`}>
                  {lang.pending}
                </button>
                <button type='button' onClick={() => setNewTaskStatus("completed")} className={`tdl-priority ${newTaskStatus === "completed" && "selected"}  ${resultAddTdl.isLoading && "disabled"}`}>
                  {lang.completed}
                </button>
              </div>
            </div>
            <fieldset>
              <legend><label htmlFor="addTitle">{lang.title}</label></legend>
              <textarea id="addTitle" placeholder={lang.required} required spellCheck={false} rows="1" value={newTaskTitle} onKeyDown={(e) => { if (e.key.toUpperCase() === "ENTER") { e.preventDefault() } }} onChange={e => { setNewTaskTitle(e.target.value) }} maxLength={200} className='taskOpenTitle' />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="addDescription">{lang.description}</label></legend>
              <textarea id="addDescription" spellCheck={false} rows="4" value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} maxLength={2000} className='taskOpenContent' />
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
