import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import { useAddUserMutation, useDeleteUserMutation, useEditUserMutation } from '../store/slices/apiSlice';

export default function UsersDataModal() {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)
  const modalData = useSelector(state => state.modal.data)

  const [addUser, resultAddUser] = useAddUserMutation()
  const [deleteUser, resultDeleteUser] = useDeleteUserMutation()
  const [editUser, resultEditUser] = useEditUserMutation()


  const [newUserName, setNewUserName] = useState("")
  const [newUserArea, setNewUserArea] = useState("")
  const [newUserLocation, setNewUserLocation] = useState("")
  const [newUserComment, setNewUserComment] = useState("")
  const [newUserIntern, setNewUserIntern] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")

  const [editMode, setEditMode] = useState(false)

  const addUserFn = async (e) => {
    e.preventDefault()
    const user = {
      name: newUserName,
      email: newUserEmail,
      intern: newUserIntern,
      area: newUserArea,
      location: newUserLocation,
      comment: newUserComment,
    }
    const newRes = await addUser(user)
    console.log(newRes)
    dispatch(setModal({ active: false, data: {} }))
  }

  const deleteUserFn = async (id) => {
    const delRes = await deleteUser(id)
    console.log(delRes)
    dispatch(setModal({ active: false, data: {} }))
  }

  const editModeFN = () => {
    setNewUserName(modalData?.name)
    setNewUserArea(modalData?.area)
    setNewUserLocation(modalData?.location)
    setNewUserComment(modalData?.comment)
    setNewUserEmail(modalData?.email)
    setNewUserIntern(modalData?.intern)
    setEditMode(true)
  }

  const editUserFn = async (e, id) => {
    e.preventDefault()
    const user = {
      name: newUserName,
      email: newUserEmail,
      intern: newUserIntern,
      area: newUserArea,
      location: newUserLocation,
      comment: newUserComment,
      id
    }

    const editRes = await editUser(user)
    console.log(editRes)
    dispatch(setModal({ active: false, data: {} }))
  }

  useEffect(() => {

    if (!modalActive) {
      setNewUserName("")
      setNewUserArea("")
      setNewUserLocation("")
      setNewUserComment("")
      setNewUserEmail("")
      setNewUserIntern("")
      /*    setNewDeviceType("")
            setNewDeviceModel("")
            setNewDeviceSn("")
            setNewDeviceArea("")
            setNewDeviceLocation("")
            setNewDeviceComment("") */
      setEditMode(false)
    }
  }, [modalActive])



  return (
    <>
      {modalData?.userData && !editMode &&
        <form className='mainModal__data__inputs'>
          <h2>USER</h2>
          <input readOnly spellCheck={false} type="text" title="User" placeholder='User' value={modalData?.name} />
          <input readOnly spellCheck={false} type="text" title="E-Mail" placeholder='E-Mail' value={modalData?.email} />
          <input readOnly spellCheck={false} type="text" title="Area" placeholder='Area' value={modalData?.area} />
          <select readOnly disabled title="Location" >
            <option readOnly value="Location" disabled selected={modalData?.location === ""} >Location</option>
            <option readOnly value="SS" selected={modalData?.location === "SS"}>SS</option>
            <option readOnly value="PB" selected={modalData?.location === "PB"}>PB</option>
            <option readOnly value="1P" selected={modalData?.location === "1P"}>1P</option>
            <option readOnly value="4P" selected={modalData?.location === "4P"}>4P</option>
          </select>
          <input readOnly spellCheck={false} type="text" title="Intern" placeholder='Intern' value={modalData?.intern} />
          <textarea readOnly spellCheck={false} rows="2" title="Comment" placeholder='Comment' value={modalData?.comment} />
          <div className='mainModal__btnContainer--edit'>
            <button type='button' className='mainModal__send' onClick={() => deleteUserFn(modalData?.id)}>Delete</button>
            <button type='button' className='mainModal__send' onClick={() => editModeFN()}>Edit</button>
          </div>

        </form>
      }

      {modalData?.userData && editMode &&
        <form className='mainModal__data__inputs editMode' onSubmit={(e) => editUserFn(e, modalData.id)}>
          <h2>EDIT USER</h2>
          <input spellCheck={false} type="text" title="User" placeholder='User' value={newUserName} onChange={e => setNewUserName(e.target.value)} maxLength={200} pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$" required />
          <input spellCheck={false} type="text" title="E-Mail" placeholder='E-Mail' value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
          <input spellCheck={false} type="text" title="Area" placeholder='Area' value={newUserArea} onChange={e => setNewUserArea(e.target.value)} maxLength={200} />
          <select onChange={e => setNewUserLocation(e.target.value)} title="Location">
            <option value="Location" disabled selected={modalData?.location === ""} >Location</option>
            <option value="SS" selected={modalData?.location === "SS"}>SS</option>
            <option value="PB" selected={modalData?.location === "PB"}>PB</option>
            <option value="1P" selected={modalData?.location === "1P"}>1P</option>
            <option value="4P" selected={modalData?.location === "4P"}>4P</option>
          </select>
          <input spellCheck={false} type="tel" title="Intern" placeholder='Intern' value={newUserIntern} onChange={e => {
            const value = e.target.value.replace(/\D/g, '');
            setNewUserIntern(value)
          }} maxLength={20} />
          <textarea spellCheck={false} rows="2" title="Comment" placeholder='Comment' value={newUserComment} onChange={e => setNewUserComment(e.target.value)} maxLength={500} />
          <div className='mainModal__btnContainer--edit'>
            <button className='mainModal__send' >Send</button>
            <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </form>
      }

      {modalData?.newUser &&
        <form className='mainModal__data__inputs' onSubmit={(e) => addUserFn(e)}>
          <h2>ADD USER</h2>
          <input spellCheck={false} type="text" title="User" placeholder='User' value={newUserName} onChange={e => setNewUserName(e.target.value)} maxLength={200} pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$" required />
          <input spellCheck={false} type="text" title="E-Mail" placeholder='E-Mail' value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
          <input spellCheck={false} type="text" title="Area" placeholder='Area' value={newUserArea} onChange={e => setNewUserArea(e.target.value)} maxLength={200} />
          <select onChange={e => setNewUserLocation(e.target.value)} title="Location">
            <option value="Location" disabled selected>Location</option>
            <option value="SS">SS</option>
            <option value="PB">PB</option>
            <option value="1P">1P</option>
            <option value="4P">4P</option>
          </select>
          <input spellCheck={false} type="tel" title="Intern" placeholder='Intern' value={newUserIntern} onChange={e => {
            const value = e.target.value.replace(/\D/g, '');
            setNewUserIntern(value)
          }} maxLength={20} />
          <textarea spellCheck={false} rows="2" title="Comment" placeholder='Comment' value={newUserComment} onChange={e => setNewUserComment(e.target.value)} maxLength={500} />
          <div className='mainModal__btnContainer'>
            <button className='mainModal__send'>Send</button>
          </div>
        </form>
      }
    </>
  )
}
