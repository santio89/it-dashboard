import { useDispatch } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useGetUsersQuery } from '../store/slices/apiSlice';
import { useEffect } from "react";
import UserChart from "./UserChart";

export default function Users() {
  const dispatch = useDispatch()

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();


  return (
    <div className='site-section users'>
      <div className="users__list">
        {/* add user option (for admins) - with modal .  edit/delete user option /for admins) - options in modal*/}
        <button onClick={() => dispatch(setModal({ active: true, data: { newUser: true } }))}>Add user</button>
        {isLoading ? "Loading..." :
          <ul>
            {
              data?.map(user =>
                <li key={user.id}><button onClick={() => { dispatch(setModal({ active: true, data: { userData: true, ...user } })) }}>{user.name}</button></li>)
            }
          </ul>
        }
      </div>
      <div className="users__chart">
        <UserChart data={data} />
      </div>
    </div>
  )
}
