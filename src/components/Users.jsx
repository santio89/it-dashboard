import { useDispatch } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useGetUsersQuery } from '../store/slices/apiSlice';
import { useEffect } from "react";
import UsersChart from "./UsersChart";

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
        <div className="usersWrapper">
          {isLoading ? "Loading..." :
            <ul>
              {
                data?.map(user =>
                  <li key={user.id}><button title={user.name} onClick={() => { dispatch(setModal({ active: true, data: { userData: true, ...user } })) }}>{user.name}</button></li>)
              }
            </ul>
          }
        </div>
      </div>
      <div className="users__chart">
        <button>Users per area</button>
        <div className="chartWrapper">
          <UsersChart data={data} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
