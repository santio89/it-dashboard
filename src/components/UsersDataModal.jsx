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
  const [newUserRole, setNewUserRole] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")

  const [editMode, setEditMode] = useState(false)

  const addUserFn = async (e) => {
    e.preventDefault()
    const user = {
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      intern: newUserIntern.trim(),
      role: newUserRole.trim(),
      area: newUserArea.trim(),
      location: newUserLocation.trim(),
      comment: newUserComment.trim(),
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
    setNewUserRole(modalData?.role)
    setEditMode(true)
  }

  const editUserFn = async (e, id) => {
    e.preventDefault()
    const user = {
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      intern: newUserIntern.trim(),
      role: newUserRole.trim(),
      area: newUserArea.trim(),
      location: newUserLocation.trim(),
      comment: newUserComment.trim(),
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
      setNewUserRole("")
      setEditMode(false)
    }
  }, [modalActive])



  return (
    <>
      {modalData?.userData && !editMode &&
        <form className='mainModal__data__form'>
          <h2>USER</h2>
          <div className="form-group">
            <fieldset>
              <legend>Name</legend>
              <input readOnly disabled spellCheck={false} type="text" title="Name" placeholder='Name' value={modalData?.name || "-"} />
            </fieldset>
            <fieldset>
              <legend>E-Mail</legend>
              <input readOnly disabled spellCheck={false} type="text" title="E-Mail" placeholder='E-Mail' value={modalData?.email || "-"} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Area</legend>
              <input readOnly disabled spellCheck={false} type="text" title="Area" placeholder='Area' value={modalData?.area || "-"} />
            </fieldset>
            <fieldset>
              <legend>Location</legend>
              <select readOnly disabled title="Location">
                <option readOnly disabled value="Location" selected={modalData?.location === ""} >-</option>
                <option readOnly disabled value="SS" selected={modalData?.location === "SS"}>SS</option>
                <option readOnly disabled value="PB" selected={modalData?.location === "PB"}>PB</option>
                <option readOnly disabled value="1P" selected={modalData?.location === "1P"}>1P</option>
                <option readOnly disabled value="4P" selected={modalData?.location === "4P"}>4P</option>
              </select>
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Intern</legend>
              <input readOnly disabled spellCheck={false} type="text" title="Intern" placeholder='Intern' value={modalData?.intern || "-"} />
            </fieldset>
            <fieldset>
              <legend>Role</legend>
              <input readOnly disabled spellCheck={false} type="text" title="Role" placeholder='Role' value={modalData?.role || "-"} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Comment</legend>
              <textarea readOnly disabled spellCheck={false} rows="2" title="Comment" placeholder='Comment' value={modalData?.comment || "-"} />
            </fieldset>
          </div>
          <div className='mainModal__btnContainer--edit'>
            <button type='button' className='mainModal__send' onClick={() => deleteUserFn(modalData?.id)}>Delete</button>
            <button type='button' className='mainModal__send' onClick={() => editModeFN()}>Edit</button>
          </div>
        </form>
      }

      {modalData?.userData && editMode &&
        <form className='mainModal__data__form editMode' onSubmit={(e) => editUserFn(e, modalData.id)}>
          <h2>EDIT USER</h2>
          <div className="form-group">
            <fieldset>
              <legend>Name</legend>
              <input spellCheck={false} type="text" title="Name" placeholder='Name' value={newUserName} onChange={e => setNewUserName(e.target.value.trimStart())} maxLength={200} pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$" required />
            </fieldset>
            <fieldset>
              <legend>E-Mail</legend>
              <input spellCheck={false} type="text" title="E-Mail" placeholder='E-Mail' value={newUserEmail} onChange={e => setNewUserEmail(e.target.value.trimStart())} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Area</legend>
              <input spellCheck={false} type="text" title="Area" placeholder='Area' value={newUserArea} onChange={e => setNewUserArea(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
            <fieldset>
              <legend>Location</legend>
              <select onChange={e => setNewUserLocation(e.target.value.trimStart())} title="Location" className={newUserLocation === "" && "empty-select"}>
                <option value="Location" disabled selected={modalData?.location === ""} className='empty-select'>Location</option>
                <option value="">-</option>
                <option value="SS" selected={modalData?.location === "SS"}>SS</option>
                <option value="PB" selected={modalData?.location === "PB"}>PB</option>
                <option value="1P" selected={modalData?.location === "1P"}>1P</option>
                <option value="4P" selected={modalData?.location === "4P"}>4P</option>
              </select>
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Intern</legend>
              <input spellCheck={false} type="tel" title="Intern" placeholder='Intern' value={newUserIntern} onChange={e => {
                const value = e.target.value.replace(/\D/g, '').trimStart();
                setNewUserIntern(value)
              }} maxLength={20} />
            </fieldset>
            <fieldset>
              <legend>Role</legend>
              <input spellCheck={false} type="text" title="Role" placeholder='Role' value={newUserRole} onChange={e => setNewUserRole(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Comment</legend>
              <textarea spellCheck={false} rows="2" title="Comment" placeholder='Comment' value={newUserComment} onChange={e => setNewUserComment(e.target.value.trimStart())} maxLength={500} />
            </fieldset>
          </div>
          <div className='mainModal__btnContainer--edit'>
            <button className='mainModal__send' >Send</button>
            <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </form>
      }

      {modalData?.newUser &&
        <form className='mainModal__data__form' onSubmit={(e) => addUserFn(e)}>
          <h2>ADD USER</h2>
          <div className="form-group">
            <fieldset>
              <legend>Name</legend>
              <input spellCheck={false} type="text" title="Name" placeholder='Name' value={newUserName} onChange={e => setNewUserName(e.target.value.trimStart())} maxLength={200} pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$" required />
            </fieldset>
            <fieldset>
              <legend>E-Mail</legend>
              <input spellCheck={false} type="text" title="E-Mail" placeholder='E-Mail' value={newUserEmail} onChange={e => setNewUserEmail(e.target.value.trimStart())} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Area</legend>
              <input spellCheck={false} type="text" title="Area" placeholder='Area' value={newUserArea} onChange={e => setNewUserArea(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
            <fieldset>
              <legend>Location</legend>
              <select onChange={e => setNewUserLocation(e.target.value.trimStart())} title="Location" className={newUserLocation === "" && "empty-select"}>
                <option value="Location" disabled selected className='empty-select'>Location</option>
                <option value="">-</option>
                <option value="SS">SS</option>
                <option value="PB">PB</option>
                <option value="1P">1P</option>
                <option value="4P">4P</option>
              </select>
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Intern</legend>
              <input spellCheck={false} type="tel" title="Intern" placeholder='Intern' value={newUserIntern} onChange={e => {
                const value = e.target.value.replace(/\D/g, '').trimStart();
                setNewUserIntern(value)
              }} maxLength={20} />
            </fieldset>
            <fieldset>
              <legend>Role</legend>
              <input spellCheck={false} type="text" title="Role" placeholder='Role' value={newUserRole} onChange={e => setNewUserRole(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Comment</legend>
              <textarea spellCheck={false} rows="2" title="Comment" placeholder='Comment' value={newUserComment} onChange={e => setNewUserComment(e.target.value.trimStart())} maxLength={500} />
            </fieldset>
          </div>
          <div className='mainModal__btnContainer'>
            <button className='mainModal__send'>Send</button>
          </div>
        </form>
      }
    </>
  )
}
