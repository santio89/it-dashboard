import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import Draggable from 'react-draggable';
import ContactsDataModal from './ContactsDataModal';
import DevicesDataModal from './DevicesDataModal';
import TDLDataModal from './TDLDataModal';
import ProfileDataModal from './ProfileDataModal';

export default function Modal() {
  const dispatch = useDispatch()
  const modal = useRef()
  const modalActive = useSelector(state => state.modal.active)
  const modalData = useSelector(state => state.modal.data)
  const [isDragged, setIsDragged] = useState(false)



  useEffect(() => {
    const closeModalClick = (e) => {
      if (e.target === modal.current) {
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
      document.addEventListener("click", closeModalClick)
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
    <Draggable /*bounds={"parent"}*/ position={{ x: 0, y: 0 }} cancel={"button, input, textarea, select, option, .taskOpenContent"}
      onStart={() => { setIsDragged(true) }}
      onStop={() => { setIsDragged(false) }} >
      <dialog className={`mainModalWrapper ${isDragged && "is-dragged"}`} ref={modal} tabIndex={0}>
        <div className="mainModal">
          <div className="mainModal__data">
            {modalData?.modalType === "ContactsDataModal" && <ContactsDataModal modalData={modalData} />}

            {modalData?.modalType === "DevicesDataModal" && <DevicesDataModal modalData={modalData} />}

            {modalData?.modalType === "TDLDataModal" && <TDLDataModal modalData={modalData} />}

            {modalData?.modalType === "ProfileDataModal" && <ProfileDataModal modalData={modalData} />}
          </div>
          <button className='mainModal__close' onClick={() => dispatch(setModal({ active: false, data: {} }))}>X</button>
        </div>
      </dialog >
    </Draggable>
  )
}
