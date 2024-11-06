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
            <div className={`taskOpenData `}>
              <div>Priority: <span className={`underline ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>{modalData?.priority}</span></div>
            </div>
            <div className="taskOpenContent">
              {modalData?.content}
            </div>
          </div>
        </>
      }
    </>
  )
}
