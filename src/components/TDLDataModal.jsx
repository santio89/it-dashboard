import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useAddTdlMutation } from '../store/slices/apiSlice'
import { setModal } from '../store/slices/modalSlice'

export default function TDLDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)
  const [addTdl, resultAddTdl] = useAddTdlMutation()

  const textInput = useRef()

  const [newTaskCategory, setNewTaskCategory] = useState(modalData?.listSelected == "all" ? "personal" : modalData?.listSelected)
  const [newTaskPriority, setNewTaskPriority] = useState("medium")
  const [listPickerOpen, setListPickerOpen] = useState(false)


  const selectList = list => {
    setNewTaskCategory(list)
    setListPickerOpen(false)
  }


  const addTdlFn = async (e) => {
    e.preventDefault()
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
  }


  useEffect(() => {
    if (!modalActive) {
      setNewTaskCategory(modalData?.listSelected == "all" ? "personal" : modalData?.listSelected)
      setListPickerOpen(false)
      /* reset inputs */
      setNewTaskCategory(modalData?.listSelected == "all" ? "personal" : modalData?.listSelected)
      setNewTaskPriority("medium")
      textInput.current.textContent = ""
    }
  }, [modalActive])


  return (
    <>
      {
        modalData?.tdlData &&
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
            <div disabled className="taskOpenContent">
              {modalData?.content}
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
                  <button className={`listPicker notSelected`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button className={`listPicker notSelected`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                </div>
              }
            </div>
          </div>
          <form disabled={resultAddTdl.isLoading} className='mainModal__data__form taskContainer' onSubmit={(e) => addTdlFn(e)}>
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
            <div aria-label='textarea' className={`taskOpenContent ${resultAddTdl.isLoading && "disabled"}`} contentEditable={!resultAddTdl.isLoading} ref={textInput} spellCheck={false} placeholder='Task'></div>
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send'>Send</button>
            </div>
          </form>
        </>
      }
    </>
  )
}
