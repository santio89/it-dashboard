import { useDispatch } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useGetContactsQuery } from '../store/slices/apiSlice';
import { useEffect, useState, useRef } from "react";
import DataChart from "./DataChart";
import autoAnimate from "@formkit/auto-animate";

export default function Contacts({ user }) {
  const dispatch = useDispatch()
  const [sortList, setSortList] = useState(false)
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")
  const listContainer = useRef()

  const [contactsList, setContactsList] = useState(null)

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


  /* order */
  useEffect(() => {
    if (dataContacts) {
      /* filter */
      const filteredList = dataContacts?.filter(item => {
        return (listSelected === "all" || item.category === listSelected)
      })

      /* sort */
      let orderedList = []

      if (sortList) {
        orderedList = [...filteredList].sort((a, b) => b.name.localeCompare(a.name))
      } else {
        orderedList = [...filteredList].sort((a, b) => a.name.localeCompare(b.name))
      }

      setContactsList(orderedList)
    }
  }, [listSelected, sortList, dataContacts])

  useEffect(() => {
    !isLoadingContacts && contactsList && listContainer.current && autoAnimate(listContainer.current)
  }, [listContainer, isLoadingContacts, contactsList])

  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button disabled={isLoadingContacts} onClick={() => {
            dispatch(setModal({ active: true, data: { modalType: "ContactsDataModal", newUser: true, userId: user?.uid, dataList: dataContacts } }));
            setListPickerOpen(false)
          }}>+ Add contact</button>
          <div className="listPickerWrapper">
            <div className="listPickerWrapper__btnContainer">
              {
                <button disabled={isLoadingContacts} className={`listPicker filter ${listPickerOpen && "selected"}`} onClick={() => listPickerOpen ? selectList(listSelected) : setListPickerOpen(true)}>Filter</button>
              }
              {
                listPickerOpen &&
                <div className="listPickerOptions">
                  <button disabled={isLoadingContacts} className={`listPicker ${listSelected === "personal" && "selected"}`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button disabled={isLoadingContacts} className={`listPicker ${listSelected === "company" && "selected"}`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                  <button disabled={isLoadingContacts} className={`listPicker ${listSelected === "all" && "selected"}`}
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

        <div className="sortBtn">
          <button disabled={isLoadingContacts} onClick={() => setSortList(sortList => !sortList)}>
            {
              sortList ?
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-down-alt" viewBox="0 0 16 16">
                  <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645z" />
                  <path fillRule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371zm1.57-.785L11 9.688h-.047l-.652 2.156z" />
                  <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z" />
                  <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
                </svg>
            }
          </button>
        </div>
        {
          isLoadingContacts ? <div className="loader">Loading...</div> :
            <div className="listWrapper">

              <ul className="items-list" ref={listContainer}>
                {
                  contactsList?.map(contact =>
                    <li key={contact.localId}><button disabled={contact.id === "temp-id"} title={contact.name} onClick={() => { dispatch(setModal({ active: true, data: { modalType: "ContactsDataModal", contactData: true, userId: user?.uid, ...contact, dataList: dataContacts } })); setListPickerOpen(false) }}>{contact.name}</button></li>)
                }
                {
                  contactsList?.length === 0 && <li className="no-data">No Data</li>
                }
              </ul>
            </div>
        }
      </div>
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button disabled={isLoadingContacts}>Charts</button>
        </div>
        <div className="chartWrapper">
          {
            isLoadingContacts ? <div className="loader">Loading...</div> :
              <DataChart type={{ property: "category", items: "contacts" }} data={dataContacts} />
          }

        </div>
      </div>
    </>
  )
}
