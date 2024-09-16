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
          <button tabIndex={-1} className={`listPicker disabled`} >{modalData?.category === "company" ? "Company" : "Personal"}</button>
        </div>
      </div>
      <div className='mainModal__data__taskContainer'>
        <div className={`taskOpenData `}>
          <div>Task priority: <span className={`underline ${modalData?.priority === "low" && "selectedLow"} ${modalData?.priority === "medium" && "selectedMedium"} ${modalData?.priority === "high" && "selectedHigh"}`}>{modalData?.priority}</span></div>
          <div>Task ID: <span>{modalData?.id}</span></div>
        </div>
        <div className="taskOpenContent">
          {modalData?.content}
        </div>
      </div>
    </>
  )
}
