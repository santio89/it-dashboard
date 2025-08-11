import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from '../hooks/useTranslation'
import autoAnimate from '@formkit/auto-animate'
import { setModal } from '../store/slices/modalSlice'
import { useEditTdlMutation, useEditSupportMutation } from '../store/slices/apiSlice'
import { toast } from 'sonner'

function SectionDataList({ section, user, data, dataList, isLoadingData, isFetchingData, handleRefetch, dataLastVisible, firstLoad }) {
  const lang = useTranslation()
  const dispatch = useDispatch()
  const listContainer = useRef()
  const [dataOptions, setDataOptions] = useState(null)

  /* tasks */
  const [editTdl, resultEditTdl] = useEditTdlMutation()
  const [editSupport, resultEditSupport] = useEditSupportMutation()

  const editStatusFnTickets = async (task) => {
    if (resultEditTdl.isLoading || isFetchingData) {
      return
    }

    const newTask = { ...task, status: task.status === "completed" ? "pending" : "completed" }

    try {
      toast(`${lang.editingTask}...`)
      const res = await editTdl(newTask)
      toast.message(`${lang.status}: ${lang[res.data.status]}`, {
        description: `ID: ${res.data.id}`,
      });
    } catch {
      toast(lang.errorPerformingRequest)
    }
  }
  /* end tasks */

  /* support */
  const editStatusFnSupport = async (ticket) => {
    if (resultEditSupport.isLoading || isFetchingData) {
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
  /* end support */

  useEffect(() => {
    !isLoadingData && dataList && listContainer.current && autoAnimate(listContainer.current)
  }, [listContainer, dataList, isLoadingData])


  return (
    isLoadingData ? <div className="loader">{lang.loading}...</div> :
      <div className="listWrapper">

        {
          (section === "contacts" || section === "devices") &&
          <ul className="items-list" ref={listContainer}>
            {
              dataList?.length === 0 ? <li className="no-data">{lang.noData}</li> :
                <>
                  {
                    dataList?.map(data =>
                      <li className={firstLoad && "firstLoad"} key={data.localId}><button disabled={data.id === "temp-id"} title={data.name} onClick={() => { dispatch(setModal({ active: true, data: { modalType: `${section.charAt(0).toUpperCase() + section.slice(1)}DataModal`, user: user, ...data } })); }}>{data.name}</button></li>)
                  }
                </>
            }
          </ul>
        }



        {
          section === "tasks" &&
          <ul className='tasks-list' ref={listContainer}>
            {
              dataList?.length === 0 ? <li className="no-data">{lang.noData}</li> :
                <>
                  {
                    dataList?.map((data) =>
                      <li key={data.localId} className={`${data.priority === "low" && "selectedLow"} ${data.priority === "medium" && "selectedMedium"} ${data.priority === "high" && "selectedHigh"} ${firstLoad && "firstLoad"}`}>
                        {/* task options */}
                        {
                          dataOptions === data.id &&
                          <div className='tdl-btnContainer' onClick={() => {
                            setDataOptions(null)
                          }}>
                            {/* task status */}
                            <div className={`tdl-itemData`} title={`${lang.status}: ${lang[data.status] ?? lang.pending}`} onClick={(e) => {
                              e.stopPropagation();
                              if (data.id === "temp-id") return
                              editStatusFnTickets(data)
                            }}>
                              {<>
                                <span>{lang.completed}:</span>
                                <button>
                                  {data.status === "completed" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
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
                                <button disabled={data.id === "temp-id"} title={lang.info} onClick={(e) => { e.stopPropagation(); dispatch(setModal({ active: true, data: { modalType: "TasksDataModal", tasksData: true, user: user, ...data } })) }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                  </svg>
                                </button>
                              }
                            </div>
                          </div>
                        }

                        {/* task  */}
                        {
                          <>
                            {
                              dataOptions === data.id ?
                                <>
                                  <div title={data.title} className='taskContentTitle'>{data.title}</div>
                                  <div className={`taskContentBtn ${dataOptions !== data.id && data.priority === "low" && "selectedLow"} ${dataOptions !== data.id && data.priority === "medium" && "selectedMedium"} ${dataOptions !== data.id && data.priority === "high" && "selectedHigh"} ${dataOptions === data.id && "taskOption"}`}>
                                    {data.description || "-"}
                                  </div>
                                </> :
                                <>
                                  <button disabled={data.id === "temp-id"} title={data.title} className={`taskContentBtn ${dataOptions !== data.id && data.priority === "low" && "selectedLow"} ${dataOptions !== data.id && data.priority === "medium" && "selectedMedium"} ${dataOptions !== data.id && data.priority === "high" && "selectedHigh"} ${dataOptions === data.id && "taskOption"} ${data.status === "completed" && "taskCompleted"}`} onClick={() => {
                                    setDataOptions(data.id);
                                  }} >
                                    <span className="taskContentBtn__title">{data.title}</span>
                                  </button></>
                            }
                          </>
                        }
                      </li>)
                  }
                </>
            }
          </ul>
        }

        {
          section === "support" &&
          <ul className="tasks-list" ref={listContainer}>
            {
              dataList?.length === 0 ? <li className="no-data">{lang.noData}</li> :
                <>
                  {
                    dataList?.map((data) =>
                      <li key={data.localId} className={`${data.priority === "low" && "selectedLow"} ${data.priority === "medium" && "selectedMedium"} ${data.priority === "high" && "selectedHigh"} ${firstLoad && "firstLoad"}`}>
                        {/* ticket options */}
                        {
                          dataOptions === data.id &&
                          <div className='tdl-btnContainer' onClick={() => {
                            setDataOptions(null)
                          }}>
                            {/* ticket status */}
                            <div className={`tdl-itemData`} title={`Status: ${data.status ?? "pending"}`} onClick={(e) => {
                              e.stopPropagation();
                              if (data.id === "temp-id") return
                              if (user.domainAdmin) {
                                editStatusFnSupport(data)
                                return
                              } else {
                                /* toast.message(`${lang.status}: ${lang[data.status]}`, {
                                  description: `ID: ${data.id}`,
                                }); */
                                toast(`${lang.adminManagesTickets}`)
                                return
                              }

                            }}>
                              {<>
                                <span>{lang.completed}:</span>
                                <button>
                                  {data.status === "completed" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
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
                                <button disabled={data.id === "temp-id"} title={lang.info} onClick={(e) => { e.stopPropagation(); dispatch(setModal({ active: true, data: { modalType: "SupportDataModal", supportData: true, user: user, ...data } })) }}>
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
                              dataOptions === data.id ?
                                <>
                                  {user.domainAdmin && <div title={data.title} className='taskContentAuthor'>{lang.from}: {data.author}</div>}
                                  <div title={data.title} className='taskContentTitle'>{data.title}</div>
                                  <div className={`taskContentBtn ${dataOptions !== data.id && data.priority === "low" && "selectedLow"} ${dataOptions !== data.id && data.priority === "medium" && "selectedMedium"} ${dataOptions !== data.id && data.priority === "high" && "selectedHigh"} ${dataOptions === data.id && "taskOption"}`}>
                                    {data.description || "-"}
                                  </div>
                                </> :
                                <>
                                  <button disabled={data.id === "temp-id"} title={data.title} className={`taskContentBtn ${dataOptions !== data.id && data.priority === "low" && "selectedLow"} ${dataOptions !== data.id && data.priority === "medium" && "selectedMedium"} ${dataOptions !== data.id && data.priority === "high" && "selectedHigh"} ${dataOptions === data.id && "taskOption"} ${data.status === "completed" && "taskCompleted"}`} onClick={() => {
                                    setDataOptions(data.id);
                                  }} >
                                    {user.domainAdmin && <span className="taskContentBtn__author">{lang.from}: {data.author}</span>}
                                    <span className="taskContentBtn__title">{data.title}</span>
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
        }


        <div className="listWrapper__loadMore">
          <div>{lang.showing}: {dataList?.length} - {lang.total}: {data?.length}</div>
          {<button onClick={handleRefetch} disabled={!dataLastVisible}>{dataLastVisible ? `${lang.loadMore}...` : lang.allLoaded}</button>}
        </div>
      </div>
  )
}

export default SectionDataList