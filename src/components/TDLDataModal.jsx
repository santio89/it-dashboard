import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useAddTdlMutation } from '../store/slices/apiSlice'
import { setModal } from '../store/slices/modalSlice'
import { useDeleteTdlMutation, useEditTdlMutation } from '../store/slices/apiSlice'

export default function TDLDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)
  const [addTdl, resultAddTdl] = useAddTdlMutation()

  const textInput = useRef()
  const textInputEdit = useRef()

  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [newTaskPriority, setNewTaskPriority] = useState("medium")
  const [newTaskCategory, setNewTaskCategory] = useState("personal")

  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  const [deleteTdl, resultDeleteTdl] = useDeleteTdlMutation()
  const [editTdl, resultEditTdl] = useEditTdlMutation()

  const selectList = list => {
    setNewTaskCategory(list)
    setListPickerOpen(false)
  }


  const addTdlFn = async () => {
    if (resultAddTdl.isLoading) {
      return
    }

    if (textInput.current.textContent.trim() === "") {

      return
    }
    const task = {
      content: textInput.current.textContent.trim(),
      priority: newTaskPriority,
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
    /* textInputEdit.current.textContent = modalData?.content */
    setNewTaskPriority(modalData?.priority)
    setNewTaskCategory(modalData?.category)
    setEditMode(true)
  }

  const editTaskFn = async (task) => {
    if (resultEditTdl.isLoading) {
      return
    }

    const input = textInputEdit.current.textContent.trim()
    const priority = newTaskPriority.trim()
    const category = newTaskCategory.trim()

    if ((input.trim() === "" || input.trim() === task.content) && (task.priority === (priority ?? task.priority)) && (task.category === (category ?? task.category))) {
      dispatch(setModal({ active: false, data: {} }))
      return
    }

    const newTask = { ...task, content: input.trim(), category: category ?? task.category, priority: priority ?? task.priority }

    await editTdl(newTask)
    dispatch(setModal({ active: false, data: {} }))

    /* timeout-refetch */
    /*  setTimeout(() => {
       dispatch(setModal({ active: false, data: {} }))
     }, 400) */
  }


  const deleteTdlFn = async (task) => {
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


  useEffect(() => {
    if (!modalActive) {
      setListPickerOpen(false)
      setNewTaskCategory("personal")
      setNewTaskPriority("medium")
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
              <button tabIndex={-1} className={`listPicker disabled`} >{modalData?.category === "company" ? "Company" : "Personal"}</button>
            </div>
          </div>
          <form className='mainModal__data__form taskContainer disabled'>
            <div className={`taskOpenData`}>
              <div>Priority: </div>
              <button tabIndex={-1} type='button' disabled onClick={() => setNewTaskPriority("low")} className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                </svg>
                {modalData?.priority}
              </button>
            </div>
            <fieldset>
              <legend>Description</legend>
              <div aria-label='textarea' className={`taskOpenContent`}>{modalData?.content}</div>
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
              {
                <button disabled={resultEditTdl.isLoading} className={`listPicker ${listPickerOpen && "selected"} ${resultEditTdl.isLoading && "disabled"}`} onClick={() => listPickerOpen ? selectList(newTaskCategory === "personal" ? "personal" : "company") : setListPickerOpen(true)}>{newTaskCategory === "personal" ? "Personal" : "Company"}</button>
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
          <form className='mainModal__data__form taskContainer editMode' disabled={resultEditTdl.isLoading}>
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
            <fieldset>
              <legend>Description</legend>
              <div aria-label='textarea' className={`taskOpenContent ${resultAddTdl.isLoading && "disabled"}`} contentEditable={!resultEditTdl.isLoading} ref={textInputEdit} spellCheck={false}>{modalData?.content}</div>
            </fieldset>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>Cancel</button>
              <button type='button' className='mainModal__send' onClick={() => editTaskFn(modalData)}>Confirm</button>
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
              <button tabIndex={-1} className={`listPicker disabled`} >{modalData?.category === "company" ? "Company" : "Personal"}</button>
            </div>
          </div>
          <form className='mainModal__data__form taskContainer deleteMode disabled' disabled={resultDeleteTdl.isLoading}>
            <div className={`taskOpenData`}>
              <div>Priority: </div>
              <button tabIndex={-1} type='button' disabled onClick={() => setNewTaskPriority("low")} className={`tdl-priority selected ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                </svg>
                {modalData?.priority}
              </button>
            </div>
            <fieldset>
              <legend>Description</legend>
              <div aria-label='textarea' className={`taskOpenContent`}>{modalData?.content}</div>
            </fieldset>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>Cancel</button>
              <button type='button' className='mainModal__send' onClick={() => deleteTdlFn(modalData)}>Confirm</button>
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
              {
                <button disabled={resultAddTdl.isLoading} className={`listPicker ${listPickerOpen && "selected"} ${resultAddTdl.isLoading && "disabled"}`} onClick={() => listPickerOpen ? selectList(newTaskCategory === "personal" ? "personal" : "company") : setListPickerOpen(true)}>{newTaskCategory === "personal" ? "Personal" : "Company"}</button>
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
          <form disabled={resultAddTdl.isLoading} className='mainModal__data__form taskContainer'>
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
            <fieldset>
              <legend>Description</legend>
              <div aria-label='textarea' className={`taskOpenContent ${resultAddTdl.isLoading && "disabled"}`} contentEditable={!resultAddTdl.isLoading} ref={textInput} spellCheck={false}></div>
            </fieldset>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => addTdlFn()}>Send</button>
            </div>
          </form>
        </>
      }
    </>
  )
}
