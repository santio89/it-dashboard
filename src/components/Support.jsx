import { useRef, useState, useEffect } from "react"
import DataChart from "./DataChart"
import { useDispatch } from "react-redux"
import { setModal } from "../store/slices/modalSlice"
import { useGetSupportQuery, useEditSupportMutation, useSetSupportMutation } from "../store/slices/apiSlice"
import autoAnimate from "@formkit/auto-animate"
import { useTranslation } from "../hooks/useTranslation"
import { toast } from "sonner"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { firebaseDb as db } from "../config/firebase"

const formFields = ["author", "title", "description", "priority", "status"]

export default function Support({ user }) {
  const lang = useTranslation()

  const dispatch = useDispatch()

  const [sortList, setSortList] = useState(false)

  const [ticketOptions, setTicketOptions] = useState(null)

  const [supportList, setSupportList] = useState(null)
  const [firstLoad, setFirstLoad] = useState(null)

  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")

  const [graphicPickerOpen, setGraphicPickerOpen] = useState(false)
  const [graphicSelected, setGraphicSelected] = useState([])

  const listPickerRef = useRef()
  const graphicPickerRef = useRef()

  const listContainer = useRef()

  const [editSupport, resultEditSupport] = useEditSupportMutation()
  const [setSupport, resultSetSupport] = useSetSupportMutation()

  let {
    data: dataSupport,
    isLoading: isLoadingSupport,
    isFetching: isFetchingSupport,
    isSuccess: isSuccessSupport,
    isError: isErrorSupport,
    error: errorSupport,
  } = useGetSupportQuery(/* user.domainAdmin ? "admin" : */ user.uid);

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

  const editStatusFn = async (ticket) => {
    if (resultEditSupport.isLoading || isFetchingSupport) {
      return
    }

    const newTicket = { ...ticket, status: ticket.status === "completed" ? "pending" : "completed", reply: ticket.status === "completed" ? "" : lang.ticketClosed }

    try {
      toast(`${lang.editingTicket}...`)
      const res = await editSupport(newTicket)
      toast.message(`${lang.status}: ${lang[res.data.status]}`, {
        description: `ID: ${res.data.id}`,
      });
    } catch {
      toast(lang.errorPerformingRequest)
    }
  }

  const setSupportFn = async (data) => {
    await setSupport(data)
  }


  useEffect(() => {
    if (dataSupport) {
      /* filter */
      const filteredList = dataSupport?.filter(item => {
        return (listSelected === "all" || item.status === listSelected)
      })

      /* sort */
      let orderedList = []

      if (sortList) {
        orderedList = [...filteredList].sort((a, b) => a.localTime - b.localTime);
      } else {
        orderedList = [...filteredList].sort((a, b) => b.localTime - a.localTime);
      }

      setSupportList(orderedList)
    }
  }, [dataSupport, sortList, listSelected])


  useEffect(() => {
    if (user.domainAdmin) {
      let firstSnapshot = true;
      const collectionRef = collection(db, "supportData")
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

        setSupportFn(handleArray)
      })
    } else {
      let firstSnapshot = true;
      const collectionRef = collection(db, "supportData")
      const queryRef = query(collectionRef, where('authorId', "==", user.uid))

      onSnapshot(queryRef, (snapshot) => {
        if (firstSnapshot) {
          firstSnapshot = false;
          return
        }

        let handleArray = []
        snapshot.docs.forEach(doc => {
          handleArray.push(doc.data())
        })
        handleArray.userId = user.uid

        setSupportFn(handleArray)
      })
    }
  }, [user])

  useEffect(() => {
    ticketOptions && setTicketOptions(null)
  }, [listSelected])

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
    !isLoadingSupport && supportList && listContainer.current && autoAnimate(listContainer.current)
  }, [listContainer, isLoadingSupport, supportList])

  useEffect(() => {
    let timeout;

    if (!isLoadingSupport) {
      timeout = setTimeout(() => {
        setFirstLoad(false)
      }, 0)
    } else {
      setFirstLoad(true)
    }

    return () => clearTimeout(timeout)
  }, [isLoadingSupport])


  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button disabled={isLoadingSupport} onClick={() => {
            dispatch(setModal({ active: true, data: { modalType: "SupportDataModal", newTicket: true, userId: user?.uid, user: user } }))
          }}>+ {lang.addTicket}</button>
          <div className="listPickerWrapper">
            <div className="listPickerWrapper__btnContainer">
              {
                <button disabled={isLoadingSupport} className={`listPicker filter ${listPickerOpen && "selected"}`} onClick={() => setListPickerOpen(listPickerOpen => !listPickerOpen)}>{lang.filter}</button>
              }
              {
                listPickerOpen &&
                <div ref={listPickerRef} className="listPickerOptions">
                  <button disabled={isLoadingSupport} className={`listPicker ${listSelected === "completed" && "selected"}`}
                    onClick={() => {
                      selectList("completed")
                    }}>
                    {lang.completed}
                  </button>
                  <button disabled={isLoadingSupport} className={`listPicker ${listSelected === "pending" && "selected"}`}
                    onClick={() => {
                      selectList("pending")
                    }}>
                    {lang.pending}
                  </button>
                  <button disabled={isLoadingSupport} className={`listPicker ${listSelected === "all" && "selected"}`}
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
          <button disabled={isLoadingSupport} onClick={() => setSortList(sortList => !sortList)}>
            {
              sortList ?
                <svg style={{ transform: "rotate(180deg)" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-filter" viewBox="0 0 16 16">
                  <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-filter" viewBox="0 0 16 16">
                  <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                </svg>
            }
          </button>
        </div>
        {
          isLoadingSupport ? <div className="loader">{lang.loading}...</div> :
            <div className="listWrapper">
              <ul className="support-list" ref={listContainer}>
                {
                  supportList?.length === 0 ? <li className="no-data">{lang.noData}</li> :
                    <>
                      {
                        supportList?.map((ticket) =>
                          <li key={ticket.localId} className={`${ticket.priority === "low" && "selectedLow"} ${ticket.priority === "medium" && "selectedMedium"} ${ticket.priority === "high" && "selectedHigh"} ${firstLoad && "firstLoad"}`}>
                            {/* ticket options */}
                            {
                              ticketOptions === ticket.id &&
                              <div className='tdl-btnContainer' onClick={() => {
                                setTicketOptions(null)
                              }}>
                                {/* ticket status */}
                                <div className={`tdl-itemData`} title={`Status: ${ticket.status ?? "pending"}`} onClick={(e) => {
                                  e.stopPropagation();
                                  setListPickerOpen(false);
                                  setGraphicPickerOpen(false);
                                  if (ticket.id === "temp-id") return
                                  if (user.domainAdmin) {
                                    editStatusFn(ticket)
                                    return
                                  } else {
                                    toast(`${lang.adminManagesTickets}`)
                                    toast.message(`${lang.status}: ${lang[ticket.status]}`, {
                                      description: `ID: ${ticket.id}`,
                                    });
                                    return
                                  }

                                }}>
                                  {<>
                                    <span>{lang.completed}:</span>
                                    <button>
                                      {ticket.status === "completed" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                      </svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-square" viewBox="0 0 16 16">
                                          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                        </svg>
                                      }
                                    </button>
                                  </>
                                  }
                                </div>
                                <div className={`tdl-optionsBtns`}>
                                  {
                                    /* open */
                                    <button disabled={ticket.id === "temp-id"} title={lang.info} onClick={(e) => { e.stopPropagation(); dispatch(setModal({ active: true, data: { modalType: "SupportDataModal", supportData: true, user: user, ...ticket } })) }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                      </svg>
                                    </button>
                                  }
                                </div>
                              </div>
                            }

                            {/* ticket  */}
                            {
                              <>
                                {
                                  ticketOptions === ticket.id ?
                                    <>
                                      {user.domainAdmin && <div title={ticket.title} className='taskContentAuthor'>{lang.from}: {ticket.author}</div>}
                                      <div className={`taskContentBtn ${ticketOptions !== ticket.id && ticket.priority === "low" && "selectedLow"} ${ticketOptions !== ticket.id && ticket.priority === "medium" && "selectedMedium"} ${ticketOptions !== ticket.id && ticket.priority === "high" && "selectedHigh"} ${ticketOptions === ticket.id && "taskOption"}`}>
                                        <span className="taskContentBtn__title">{ticket.title || "-"}</span>
                                        <span className="taskContentBtn__content">{ticket.content || "-"}</span>
                                      </div>
                                    </> :
                                    <>
                                      <button disabled={ticket.id === "temp-id"} title={ticket.title} className={`taskContentBtn ${ticketOptions !== ticket.id && ticket.priority === "low" && "selectedLow"} ${ticketOptions !== ticket.id && ticket.priority === "medium" && "selectedMedium"} ${ticketOptions !== ticket.id && ticket.priority === "high" && "selectedHigh"} ${ticketOptions === ticket.id && "taskOption"} ${ticket.status === "completed" && "taskCompleted"}`} onClick={() => {
                                        setTicketOptions(ticket.id);
                                      }} >
                                        {user.domainAdmin && <span className="taskContentBtn__author">{lang.from}: {ticket.author}</span>}
                                        <span className="taskContentBtn__title">{ticket.title}</span>
                                      </button></>
                                }
                              </>
                            }
                          </li>
                        )
                      }
                    </>
                }
              </ul>
            </div>
        }
      </div>
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button className={`${graphicPickerOpen && "selected"}`} disabled={isLoadingSupport} onClick={() => { setGraphicPickerOpen(graphicPickerOpen => !graphicPickerOpen) }}>{lang.charts}</button>

          {
            graphicPickerOpen &&
            <div ref={graphicPickerRef} className="listPickerOptions">
              {formFields.map((field) => {
                return <button key={field} disabled={isLoadingSupport} className={`listPicker ${graphicSelected.includes(field) && "selected"}`}
                  onClick={() => {
                    selectGraphic(field)
                  }}>
                  {
                    lang[field]
                  }
                </button>
              })}
              <button key={"graphPickerBtn-none"} disabled={isLoadingSupport} className={`listPicker ${graphicSelected.length === 0 && "selected"}`}
                onClick={() => {
                  selectGraphic("none")
                }}>
                {
                  lang["none"]
                }
              </button>
              <button key={"graphPickerBtn-all"} disabled={isLoadingSupport} className={`listPicker ${graphicSelected.length === formFields.length && "selected"}`}
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
        <div className="chartWrapper">
          {
            isLoadingSupport ? <div className="loader">{lang.loading}...</div> :
              <>
                {
                  graphicSelected.length === 0 ?
                    <p>{lang.noChartsSelected}</p> :
                    graphicSelected.map((graphic) => {
                      return <DataChart key={graphic} type={{ property: graphic, items: "tickets" }} data={dataSupport} firstLoad={firstLoad} />
                    })
                }
              </>
          }
        </div>
      </div>
    </>
  )
}
