import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import UsersDataModal from './UsersDataModal';

export default function Modal() {
  const dispatch = useDispatch()
  const modal = useRef()
  const modalActive = useSelector(state => state.modal.active)



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
    <dialog className='mainModalWrapper' ref={modal}>
      <div className="mainModal">
        <div className="mainModal__data">
          <UsersDataModal />

          {/*  {modalData?.newDevice &&
            <form className='mainModal__data__inputs' onSubmit={() => dispatch(setModal({ active: false, data: {} }))}>
              <h2>ADD DEVICE</h2>
              <input spellCheck={false} type="text" title="Type" placeholder='Type' value={newDeviceType} onChange={e => setNewDeviceType(e.target.value)} />
              <input spellCheck={false} type="text" title="Model" placeholder='Model' value={newDeviceModel} onChange={e => setNewDeviceModel(e.target.value)} />
              <input spellCheck={false} type="text" title="Seria" placeholder='Serial' value={newDeviceSn} onChange={e => setNewDeviceSn(e.target.value)} />
              <input spellCheck={false} type="text" title="Area" placeholder='Area' value={newDeviceArea} onChange={e => setNewDeviceArea(e.target.value)} />
              <select onChange={e => setNewDeviceLocation(e.target.value)} title="Location">
                <option value="Location" disabled selected>Location</option>
                <option value="SS">SS</option>
                <option value="PB">PB</option>
                <option value="1P">1P</option>
                <option value="4P">4P</option>
              </select>
              <textarea spellCheck={false} rows="2" title="Comment" placeholder='Comment' value={newDeviceComment} onChange={e => setNewDeviceComment(e.target.value)} />
              <div className='mainModal__btnContainer'>
                <button className='mainModal__send'>Send</button>
              </div>
            </form>
          } */}
        </div>

        <button className='mainModal__close' onClick={() => dispatch(setModal({ active: false, data: {} }))}>Close</button>
      </div>
    </dialog >
  )
}
