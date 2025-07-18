import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import Draggable from 'react-draggable';
import ContactsDataModal from './ContactsDataModal';
import DevicesDataModal from './DevicesDataModal';
import TasksDataModal from './TasksDataModal';
import ProfileDataModal from './ProfileDataModal';
import SupportDataModal from './SupportDataModal';

export default function Modal() {
  const dispatch = useDispatch()
  const modal = useRef()
  const innerModal = useRef()
  const modalActive = useSelector(state => state.modal.active)
  const modalData = useSelector(state => state.modal.data)
  const [isDragged, setIsDragged] = useState(false)



  useEffect(() => {
    const closeModalClick = (e) => {
      if (!innerModal.current.contains(e.target)) {
        dispatch(setModal({ active: false, data: {} }))
      }
    }

    const closeModalEsc = (e) => {
      if (e.key === "Escape") {
        e.preventDefault()
        dispatch(setModal({ active: false, data: {} }))
      }
    }

    if (modalActive) {
      /* close modal */
      document.addEventListener("mousedown", closeModalClick)
      document.addEventListener("keydown", closeModalEsc)

      try {
        document.startViewTransition(() => {
          modal.current.showModal()
          modal.current.scrollTop = 0;
        });
      } catch {
        modal.current.showModal()
        modal.current.scrollTop = 0;
      }
    } else {
      modal.current.close()
      /* try {
        document.startViewTransition(() => {
          modal.current.close()
        });
      } catch {
        modal.current.close()
      } */
    }

    return () => {
      document.removeEventListener("click", closeModalClick);
      document.removeEventListener("keydown", closeModalEsc);
    }
  }, [modalActive])


  return (
    <Draggable /*bounds={"parent"}*/ position={{ x: 0, y: 0 }} handle='h2'
      onStart={() => { setIsDragged(true) }}
      onStop={() => { setIsDragged(false) }} >
      <dialog className={`mainModalWrapper ${isDragged && "is-dragged"}`} ref={modal} tabIndex={0}>
        <div ref={innerModal} className="mainModal">
          <div className="mainModal__data">
            {modalData?.modalType === "ContactsDataModal" && <ContactsDataModal modalData={modalData} />}

            {modalData?.modalType === "DevicesDataModal" && <DevicesDataModal modalData={modalData} />}

            {modalData?.modalType === "TasksDataModal" && <TasksDataModal modalData={modalData} />}

            {modalData?.modalType === "ProfileDataModal" && <ProfileDataModal modalData={modalData} />}

            {modalData?.modalType === "SupportDataModal" && <SupportDataModal modalData={modalData} />}
          </div>
          <button className='mainModal__close' onClick={() => dispatch(setModal({ active: false, data: {} }))}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg></button>
        </div>
      </dialog >
    </Draggable>
  )
}
