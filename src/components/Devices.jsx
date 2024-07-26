import { useDispatch } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useGetDevicesQuery } from '../store/slices/apiSlice';

export default function Users() {
  const dispatch = useDispatch()

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetDevicesQuery();

  return (
    <div className='site-section users'>
      <div className="users__list">
        {/* add user option (for admins) - with modal .  edit/delete user option /for admins) - options in modal*/}
        <button onClick={() => dispatch(setModal({ active: true, data: { newDevice: true } }))}>Add device</button>
        {isLoading ? "Loading..." :
          <ul>
            {
              data?.map(device =>
                <li key={device.id}><button onClick={() => { dispatch(setModal({ active: true, data: { deviceData: true, ...device } })) }}>{device.name}</button></li>)
            }
          </ul>
        }
      </div>
      <div className="users__chart">
        CUADRO
      </div>
    </div>
  )
}
