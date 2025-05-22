import { useDispatch, useSelector } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useGetContactsQuery, useGetContactsNextQuery, useSetContactsMutation } from '../store/slices/apiSlice';
import { setFilters } from "../store/slices/themeSlice";
import { useEffect, useState, useRef } from "react";
import DataChart from "./DataChart";
import autoAnimate from "@formkit/auto-animate";
import { useTranslation } from "../hooks/useTranslation";
import Dropdown from "./Dropdown";

const formFields = ["category", "name", "email", "role", "tel", "comments"]

export default function Contacts({ user }) {
  const lang = useTranslation()

  const dispatch = useDispatch()

  const [listPickerOpen, setListPickerOpen] = useState(false)
  const listSelected = useSelector(state => state.theme.filters.contacts.list)
  const [sortList, setSortList] = useState(false)

  const [graphicPickerOpen, setGraphicPickerOpen] = useState(false)
  const graphicSelected = useSelector(state => state.theme.filters.contacts.charts)

  const listContainer = useRef()
  const chartContainer = useRef()

  const [setContacts, resultSetContacts] = useSetContactsMutation()

  const [contactsList, setContactsList] = useState(null)
  const [firstLoad, setFirstLoad] = useState(null)

  const [lastVisible, setLastVisible] = useState(null)

  /* load first batch- then load more */
  /* add filter-sort to query */
  const {
    data: { contacts: dataContacts, lastVisible: dataLastVisible } = {},
    isLoading: isLoadingContacts,
    isFetching: isFetchingContacts,
    isSuccess: isSuccessContacts,
    isError: isErrorContacts,
    error: errorContacts,
  } = useGetContactsQuery(user?.uid);

  useGetContactsNextQuery({ userId: user?.uid, lastVisible });

  const handleRefetch = () => {
    setLastVisible(dataLastVisible)
  }

  const selectList = list => {
    dispatch(setFilters({
      filters: {
        contacts: {
          list: list
        }
      }
    }))
  }

  const selectGraphic = graphic => {
    if (graphic === "none") {
      dispatch(setFilters({
        filters: {
          contacts: {
            charts: []
          }
        }
      }))
      return
    }

    if (graphic === "all") {
      dispatch(setFilters({
        filters: {
          contacts: {
            charts: [...formFields]
          }
        }
      }))
      return
    }

    if (graphicSelected.includes(graphic)) {
      dispatch(setFilters({
        filters: {
          contacts: {
            charts: graphicSelected.filter(graph => graph != graphic)
          }
        }
      }))
      return
    }

    dispatch(setFilters({
      filters: {
        contacts: {
          charts: [...graphicSelected, graphic]
        }
      }
    }))
  }

  const setContactsFn = async (data) => {
    await setContacts(data)
  }

  useEffect(() => {
    if (dataContacts) {
      /* filter-order locally */
      const filteredList = dataContacts?.filter(item => {
        return (listSelected === "all" || item.category === listSelected)
      })

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
            dispatch(setModal({ active: true, data: { modalType: "ContactsDataModal", newContact: true, userId: user?.uid } }))
          }}>+ {lang.addContact}</button>

          <button disabled={isLoadingContacts} className={`listPicker ${listPickerOpen && "selected"}`} onClick={() => setListPickerOpen(listPickerOpen => !listPickerOpen)}>{lang.filter}</button>

          {
            listPickerOpen &&
            <Dropdown dropdownOpen={listPickerOpen} setDropdownOpen={setListPickerOpen} direction="row" anchor="right">
              <button disabled={isLoadingContacts} className={`dropdownBtn ${listSelected === "personal" && "selected"}`}
                onClick={() => {
                  selectList("personal")
                }}>
                {lang.personal}
              </button>
              <button disabled={isLoadingContacts} className={`dropdownBtn ${listSelected === "company" && "selected"}`}
                onClick={() => {
                  selectList("company")
                }}>
                {lang.company}
              </button>
              <button disabled={isLoadingContacts} className={`dropdownBtn ${listSelected === "all" && "selected"}`}
                onClick={() => {
                  selectList("all")
                }}>
                {lang.all}
              </button>
            </Dropdown>
          }
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
                          <li className={firstLoad && "firstLoad"} key={contact.localId}><button disabled={contact.id === "temp-id"} title={contact.name} onClick={() => { dispatch(setModal({ active: true, data: { modalType: "ContactsDataModal", contactData: true, userId: user?.uid, ...contact } })); }}>{contact.name}</button></li>)
                      }
                    </>
                }
              </ul>
              <div className="listWrapper__loadMore">
                <div>{lang.showing}: {contactsList?.length} - {lang.total}: {dataContacts?.length}</div>
                {<button onClick={handleRefetch} disabled={!dataLastVisible}>{dataLastVisible ? `${lang.loadMore}...` : lang.allLoaded}</button>}
              </div>
            </div>
        }
      </div>
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button className={`${graphicPickerOpen && "selected"}`} disabled={isLoadingContacts} onClick={() => { setGraphicPickerOpen(graphicPickerOpen => !graphicPickerOpen) }}>{lang.charts}</button>
          {
            graphicPickerOpen &&
            <Dropdown dropdownOpen={graphicPickerOpen} setDropdownOpen={setGraphicPickerOpen} direction="column" anchor="left">
              {formFields.map((field) => {
                return <button key={field} disabled={isLoadingContacts} className={`dropdownBtn ${graphicSelected.includes(field) && "selected"}`}
                  onClick={() => {
                    selectGraphic(field)
                  }}>
                  {
                    lang[field]
                  }
                </button>
              })}
              <button key={"graphPickerBtn-none"} disabled={isLoadingContacts} className={`dropdownBtn ${graphicSelected.length === 0 && "selected"}`}
                onClick={() => {
                  selectGraphic("none")
                }}>
                {
                  lang["none"]
                }
              </button>
              <button key={"graphPickerBtn-all"} disabled={isLoadingContacts} className={`dropdownBtn ${graphicSelected.length === formFields.length && "selected"}`}
                onClick={() => {
                  selectGraphic("all")
                }}>
                {
                  lang["all"]
                }
              </button>
            </Dropdown>
          }
        </div>
        {
          isLoadingContacts ? <div className="loader">{lang.loading}...</div> :
            <div className="chartWrapper">
              <ul className="charts-list" ref={chartContainer}>
                {
                  graphicSelected?.length === 0 ?
                    <li>{lang.noChartsSelected}</li> :
                    graphicSelected?.map((graphic) => {
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
