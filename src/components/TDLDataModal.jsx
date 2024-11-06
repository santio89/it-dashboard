import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useAddTdlMutation } from '../store/slices/apiSlice'
import { setModal } from '../store/slices/modalSlice'

export default function TDLDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)
  const [addTdl, resultAddTdl] = useAddTdlMutation()

  const [newTaskCategory, setNewTaskCategory] = useState(modalData?.listSelected == "all" ? "personal" : modalData?.listSelected)
  const [listPickerOpen, setListPickerOpen] = useState(false)

  const [newTaskPriority, setNewTaskPriority] = useState("medium")

  const selectList = list => {
    setNewTaskCategory(list)
    setListPickerOpen(false)
  }


  const addTask = async () => {
    /*     if (textInput.current.textContent.trim() === "") {
       
          return
        } */
    const task = {
      /*     userId: user.uid,
          content: textInput.current.textContent.trim(),
          priority: selectedPriority,
          category: newListSelected */
    }

    await addTdl(task)
    dispatch(setModal({ active: false, data: {} }))
  }


  useEffect(() => {
    if (!modalActive) {
      setNewTaskCategory(modalData?.listSelected == "all" ? "personal" : modalData?.listSelected)
      setListPickerOpen(false)
      /* reset inputs */
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
          <div className='mainModal__data__taskContainer'>
            <div className={`taskOpenData `}>
              <div>Priority: <span className={`underline ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>{modalData?.priority}</span></div>
            </div>
            <div className="taskOpenContent">
              {modalData?.content}
            </div>
          </div>
        </>
      }
      {
        modalData?.newTask &&
        <>
          <div className="mainModal__titleContainer">
            <h2>ADD TASK</h2>
            <div className="listPickerWrapper__btnContainer">
              {
                <button className={`listPicker ${listPickerOpen && "selected"}`} onClick={() => listPickerOpen ? selectList(newTaskCategory === "personal" ? "personal" : "company") : setListPickerOpen(true)}>{newTaskCategory === "personal" ? "Personal" : "Company"}</button>
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
          <div className='mainModal__data__taskContainer'>
            <div className={`taskOpenData`}>
              <div>Priority: </div>
              <button onClick={() => setNewTaskPriority("low")} className={`tdl-priority selectedLow ${newTaskPriority === "low" && "selected"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                </svg>
                Low
              </button>
              <button onClick={() => setNewTaskPriority("medium")} className={`tdl-priority selectedMedium ${newTaskPriority === "medium" && "selected"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                </svg>
                Medium
              </button>
              <button onClick={() => setNewTaskPriority("high")} className={`tdl-priority selectedHigh ${newTaskPriority === "high" && "selected"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                </svg>
                High
              </button>
            </div>
            <textarea className="taskOpenContent">
              {modalData?.content}
            </textarea>
          </div>
        </>
      }
    </>
  )
}
