import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

export default function TDLDataModal() {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)
  const modalData = useSelector(state => state.modal.data)

  return (
    <>
      <div className="mainModal__titleContainer">
        <h2>TASK</h2>
        <div className="listPickerWrapper__btnContainer">
          <button className={`listPicker disabled`} >{modalData?.category === "company" ? "Company" : "Personal"}</button>
        </div>
      </div>
      <div className='mainModal__data__taskContainer'>
        <div className={`taskOpenPriority ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
          </svg>
          &nbsp;Task priority: {modalData?.priority}
        </div>
        <div className="taskOpenContent">
          {modalData?.content}
        </div>
      </div>
    </>
  )
}
