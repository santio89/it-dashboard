import { useDispatch } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useGetContactsQuery, useSetContactsMutation } from '../store/slices/apiSlice';
import { useEffect, useState, useRef } from "react";
import DataChart from "./DataChart";
import autoAnimate from "@formkit/auto-animate";
import { useTranslation } from "../hooks/useTranslation";
import { collection, onSnapshot } from "firebase/firestore"
import { firebaseDb as db } from "../config/firebase"

const formFields = ["category", "name", "email", "role", "tel", "comments"]

export default function Contacts({ user }) {
  const lang = useTranslation()

  const dispatch = useDispatch()

  const [sortList, setSortList] = useState(false)

  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")

  const [graphicPickerOpen, setGraphicPickerOpen] = useState(false)
  const [graphicSelected, setGraphicSelected] = useState([])

  const listPickerRef = useRef()
  const graphicPickerRef = useRef()

  const listContainer = useRef()
  const chartContainer = useRef()

  const [setContacts, resultSetContacts] = useSetContactsMutation()

  const [contactsList, setContactsList] = useState(null)
  const [firstLoad, setFirstLoad] = useState(null)

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
  }

  const selectGraphic = graphic => {
    if (graphic === "none") {
      setGraphicSelected([])
      return
    }
    if (graphic === "all") {
      setGraphicSelected([...formFields])
      return
    }
    if (graphicSelected.includes(graphic)) {
      setGraphicSelected(graphicSelected => graphicSelected.filter(graph => graph != graphic))
      return
    }
    setGraphicSelected(graphicSelected => [...graphicSelected, graphic])
  }

  const setContactsFn = async (data) => {
    await setContacts(data)
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

  /* realtime updates -> disabled (too much read quota) */
  /* useEffect(() => {
    let firstSnapshot = true;
    const collectionRef = collection(db, "authUsersData", user.uid, "contacts")

    onSnapshot(collectionRef, (snapshot) => {
      if (firstSnapshot) {
        firstSnapshot = false;
        return
      }
      let handleArray = []
      snapshot.docs.forEach(doc => {
        handleArray.push(doc.data())
      })
      handleArray.userId = user.uid

      setContactsFn(handleArray)
    })
  }, [user]) */

  useEffect(() => {
    const handlePickerCloseClick = (e) => {
      if (e.target != listPickerRef.current && !Array.from(listPickerRef.current.childNodes).some((node) => node == e.target)) {
        setListPickerOpen(false)
      }
    }

    const handlePickerCloseEsc = (e) => {
      if (e.key === "Escape") {
        setListPickerOpen(false)
      }
    }

    if (listPickerOpen) {
      setTimeout(() => {
        window.addEventListener("click", handlePickerCloseClick)
        window.addEventListener("keydown", handlePickerCloseEsc)
      }, [0])
    }

    return () => {
      window.removeEventListener("click", handlePickerCloseClick);
      window.removeEventListener("keydown", handlePickerCloseEsc)
    }

  }, [listPickerOpen])

  useEffect(() => {
    const handlePickerCloseClick = (e) => {
      if (e.target != graphicPickerRef.current && !Array.from(graphicPickerRef.current.childNodes).some((node) => node == e.target)) {
        setGraphicPickerOpen(false)
      }
    }

    const handlePickerCloseEsc = (e) => {

      if (e.key === "Escape") {
        setGraphicPickerOpen(false)
      }
    }

    if (graphicPickerOpen) {
      setTimeout(() => {
        window.addEventListener("click", handlePickerCloseClick)
        window.addEventListener("keydown", handlePickerCloseEsc)
      }, [0])

    }

    return () => {
      window.removeEventListener("click", handlePickerCloseClick);
      window.removeEventListener("keydown", handlePickerCloseEsc)
    }

  }, [graphicPickerOpen])

  useEffect(() => {
    !isLoadingContacts && contactsList && listContainer.current && autoAnimate(listContainer.current)
    !isLoadingContacts && contactsList && chartContainer.current && autoAnimate(chartContainer.current)
  }, [listContainer, chartContainer, isLoadingContacts, contactsList])

  useEffect(() => {
    let timeout;

    if (!isLoadingContacts) {
      timeout = setTimeout(() => {
        setFirstLoad(false)
      }, 0)
    } else {
      setFirstLoad(true)
    }

    return () => clearTimeout(timeout)
  }, [isLoadingContacts])


  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button disabled={isLoadingContacts} onClick={() => {
            dispatch(setModal({ active: true, data: { modalType: "ContactsDataModal", newContact: true, userId: user?.uid, dataList: dataContacts } }))
          }}>+ {lang.addContact}</button>
          <div className="listPickerWrapper">
            <div className="listPickerWrapper__btnContainer">
              {
                <button disabled={isLoadingContacts} className={`listPicker filter ${listPickerOpen && "selected"}`} onClick={() => setListPickerOpen(listPickerOpen => !listPickerOpen)}>{lang.filter}</button>
              }
              {
                listPickerOpen &&
                <div className="listPickerOptions" ref={listPickerRef}>
                  <button disabled={isLoadingContacts} className={`listPicker ${listSelected === "personal" && "selected"}`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    {lang.personal}
                  </button>
                  <button disabled={isLoadingContacts} className={`listPicker ${listSelected === "company" && "selected"}`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    {lang.company}
                  </button>
                  <button disabled={isLoadingContacts} className={`listPicker ${listSelected === "all" && "selected"}`}
                    onClick={() => {
                      selectList("all")
                    }}>
                    {lang.all}
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
          isLoadingContacts ? <div className="loader">{lang.loading}...</div> :
            <div className="listWrapper">
              <ul className="items-list" ref={listContainer}>
                {
                  contactsList?.length === 0 ? <li className="no-data">{lang.noData}</li> :
                    <>
                      {
                        contactsList?.map(contact =>
                          <li className={firstLoad && "firstLoad"} key={contact.localId}><button disabled={contact.id === "temp-id"} title={contact.name} onClick={() => { dispatch(setModal({ active: true, data: { modalType: "ContactsDataModal", contactData: true, userId: user?.uid, ...contact, dataList: dataContacts } })); }}>{contact.name}</button></li>)
                      }
                    </>
                }
              </ul>
            </div>
        }
      </div>
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button className={`${graphicPickerOpen && "selected"}`} disabled={isLoadingContacts} onClick={() => { setGraphicPickerOpen(graphicPickerOpen => !graphicPickerOpen) }}>{lang.charts}</button>

          {
            graphicPickerOpen &&
            <div ref={graphicPickerRef} className="listPickerOptions">
              {formFields.map((field) => {
                return <button key={field} disabled={isLoadingContacts} className={`listPicker ${graphicSelected.includes(field) && "selected"}`}
                  onClick={() => {
                    selectGraphic(field)
                  }}>
                  {
                    lang[field]
                  }
                </button>
              })}
              <button key={"graphPickerBtn-none"} disabled={isLoadingContacts} className={`listPicker ${graphicSelected.length === 0 && "selected"}`}
                onClick={() => {
                  selectGraphic("none")
                }}>
                {
                  lang["none"]
                }
              </button>
              <button key={"graphPickerBtn-all"} disabled={isLoadingContacts} className={`listPicker ${graphicSelected.length === formFields.length && "selected"}`}
                onClick={() => {
                  selectGraphic("all")
                }}>
                {
                  lang["all"]
                }
              </button>
            </div>
          }
        </div>
        {
          isLoadingContacts ? <div className="loader">{lang.loading}...</div> :
            <div className="chartWrapper">
              <ul className="charts-list" ref={chartContainer}>
                {
                  graphicSelected.length === 0 ?
                    <li>{lang.noChartsSelected}</li> :
                    graphicSelected.map((graphic) => {
                      return <DataChart key={graphic} type={{ property: graphic, items: "contacts" }} data={dataContacts} firstLoad={firstLoad} />
                    })
                }
              </ul>
            </div>
        }
      </div>
    </>
  )
}
