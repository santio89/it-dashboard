import { useDispatch } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import devicesData from '../data/devices'

export default function Users() {
  const dispatch = useDispatch()

  return (
    <div className='site-section users'>
      <div className="users__list">
        {/* add user option (for admins) - with modal .  edit/delete user option /for admins) - options in modal*/}
        <button onClick={() => dispatch(setModal({ active: true, data: { newDevice: true } }))}>Add device</button>
       {/*  <ul>
          {
            devicesData.devices.map(device =>
              <li key={device.id}><button onClick={() => { dispatch(setModal({ active: true, data: device })) }}>{device.type} - {device.model}</button></li>)
          }
        </ul> */}
      </div>
      <div className="users__chart">
        CUADRO
      </div>
    </div>
  )
}
