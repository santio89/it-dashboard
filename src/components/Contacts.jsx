import { useDispatch } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useGetContactsQuery } from '../store/slices/apiSlice';
import { useEffect, useState, useRef } from "react";
import DataChart from "./DataChart";
import autoAnimate from "@formkit/auto-animate";

export default function Contacts({ user }) {
  const dispatch = useDispatch()
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")
  const listContainer = useRef()

  const {
    data: dataContacts,
    isLoading: isLoadingContacts,
    isFetching: isFetchingContacts,
    isSuccess: isSuccessContacts,
    isError: isErrorContacts,
    error: errorContacts,
  } = useGetContactsQuery(user?.uid);

  const selectList = list => {
    setListSelected(list)
    setListPickerOpen(false)
  }

  useEffect(() => {
    !isLoadingContacts && listContainer.current && autoAnimate(listContainer.current)
  }, [listContainer, isLoadingContacts])

  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button onClick={() => {
            dispatch(setModal({ active: true, data: { newUser: true, userId: user?.uid, listSelected } }));
            setListPickerOpen(false)
          }}>+ Add contact</button>
          <div className="listPickerWrapper">
            <div className="listPickerWrapper__btnContainer">
              {
                <button className={`listPicker ${listPickerOpen && "selected"}`} onClick={() => listPickerOpen ? selectList(listSelected) : setListPickerOpen(true)}>Filter</button>
              }
              {
                listPickerOpen &&
                <div className="listPickerOptions">
                  <button className={`listPicker ${listSelected === "personal" && "selected"}`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button className={`listPicker ${listSelected === "company" && "selected"}`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                  <button className={`listPicker ${listSelected === "all" && "selected"}`}
                    onClick={() => {
                      selectList("all")
                    }}>
                    All
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
        {
          isLoadingContacts ? <div className="loader">Loading...</div> :
            <ul className="items-list" ref={listContainer}>
              {
                dataContacts?.map(contact => {
                  if (listSelected === "all" || contact.category === listSelected) {
                    return (<li key={contact.id}><button title={contact.name} onClick={() => { dispatch(setModal({ active: true, data: { userData: true, userId: user?.uid, ...contact } })); setListPickerOpen(false) }}>{contact.name}</button></li>)
                  } else {
                    return null
                  }
                }
                )
              }
            </ul>
        }
      </div>
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button>Contacts by category</button>
        </div>
        <div className="chartWrapper">
          <DataChart type={{ property: "category", items: "contacts" }} data={dataContacts} isLoading={isLoadingContacts} />
        </div>
      </div>
    </>
  )
}
