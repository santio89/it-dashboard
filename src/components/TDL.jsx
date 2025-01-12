import { useEffect, useRef, useState } from 'react'
import { useGetTdlQuery, useEditTdlMutation } from '../store/slices/apiSlice'
import { setModal } from '../store/slices/modalSlice'
import { useDispatch } from 'react-redux'
import DataChart from './DataChart'
import autoAnimate from "@formkit/auto-animate";

export default function TDL({ user }) {
  const dispatch = useDispatch()
  const [sortList, setSortList] = useState(false)
  const [taskOptions, setTaskOptions] = useState(null)
  const listContainer = useRef()

  const [tdlList, setTdlList] = useState(null)

  /* search */
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")

  /* edit tdl mutation */
  const [editTdl, resultEditTdl] = useEditTdlMutation()

  const {
    data: dataTdl,
    isLoading: isLoadingTdl,
    isFetching: isFetchingTdl,
    isSuccess: isSuccessTdl,
    isError: isErrorTdl,
    error: errorTdl,
  } = useGetTdlQuery(user.uid);

  const selectList = list => {
    setListSelected(list)
    setListPickerOpen(false)
  }

  const editStatusFn = async (task) => {
    if (resultEditTdl.isLoading || isFetchingTdl) {
      return
    }

    const newTask = { ...task, status: task.status === "completed" ? "pending" : "completed" }

    await editTdl(newTask)
  }

  /* order */
  useEffect(() => {
    if (dataTdl) {
      /* filter */
      const filteredList = dataTdl?.filter(item => {
        return (listSelected === "all" || item.category === listSelected)
      })

      /* sort */
      let orderedList = []

      if (sortList) {
        orderedList = [...filteredList].sort((a, b) => a.localTime - b.localTime);
      } else {
        orderedList = [...filteredList].sort((a, b) => b.localTime - a.localTime);
      }

      setTdlList(orderedList)
    }
  }, [sortList, listSelected, dataTdl])

  useEffect(() => {
    taskOptions && setTaskOptions(null)
  }, [listSelected])

  useEffect(() => {
    !isLoadingTdl && tdlList && listContainer.current && autoAnimate(listContainer.current)
  }, [listContainer, isLoadingTdl, tdlList])


  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button disabled={isLoadingTdl} onClick={() => {
            dispatch(setModal({ active: true, data: { modalType: "TDLDataModal", newTask: true, userId: user?.uid, dataList: dataTdl } }))
            setListPickerOpen(false)
          }}>+ Add task</button>
          <div className="listPickerWrapper">
            <div className="listPickerWrapper__btnContainer">
              {
                <button disabled={isLoadingTdl} className={`listPicker filter ${listPickerOpen && "selected"}`} onClick={() => listPickerOpen ? selectList(listSelected) : setListPickerOpen(true)}>Filter</button>
              }
              {
                listPickerOpen &&
                <div className="listPickerOptions">
                  <button disabled={isLoadingTdl} className={`listPicker ${listSelected === "personal" && "selected"}`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button disabled={isLoadingTdl} className={`listPicker ${listSelected === "company" && "selected"}`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                  <button disabled={isLoadingTdl} className={`listPicker ${listSelected === "all" && "selected"}`}
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
          <button disabled={isLoadingTdl} onClick={() => setSortList(sortList => !sortList)}>
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
          isLoadingTdl ? <div className="loader">Loading...</div> :
            <div className="listWrapper">
              <ul className='tdl-list' ref={listContainer}>
                {
                  tdlList?.map((task) =>
                    <li key={task.localId} className={`${task.priority === "low" && "selectedLow"} ${task.priority === "medium" && "selectedMedium"} ${task.priority === "high" && "selectedHigh"}`}>
                      {/* task options */}
                      {
                        taskOptions === task.id &&
                        <div className='tdl-btnContainer' onClick={() => {
                          setTaskOptions(null)
                        }}>
                          {/* task status */}
                          <div className={`tdl-itemData `}>
                            {<>
                              <span>Status:</span>
                              <button disabled={task.id === "temp-id"} title={`Status: ${task.status ?? "pending"}`} onClick={(e) => { e.stopPropagation(); editStatusFn(task) }}>
                                {task.status === "completed" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
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
                              <button disabled={task.id === "temp-id"} title={"Info"} onClick={(e) => { e.stopPropagation(); dispatch(setModal({ active: true, data: { modalType: "TDLDataModal", tdlData: true, ...task, dataList: dataTdl } })); setListPickerOpen(false) }}>
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
                            taskOptions === task.id ?
                              <>
                                <div title={task.title} className='taskContentTitle'>{task.title}</div>
                                <div className={`taskContentBtn ${taskOptions !== task.id && task.priority === "low" && "selectedLow"} ${taskOptions !== task.id && task.priority === "medium" && "selectedMedium"} ${taskOptions !== task.id && task.priority === "high" && "selectedHigh"} ${taskOptions === task.id && "taskOption"}`}>
                                  {task.content || "-"}
                                </div>
                              </> :
                              <>
                                <button disabled={task.id === "temp-id"} title={task.title} className={`taskContentBtn ${taskOptions !== task.id && task.priority === "low" && "selectedLow"} ${taskOptions !== task.id && task.priority === "medium" && "selectedMedium"} ${taskOptions !== task.id && task.priority === "high" && "selectedHigh"} ${taskOptions === task.id && "taskOption"} ${task.status === "completed" && "taskCompleted"}`} onClick={() => {
                                  setTaskOptions(task.id);
                                }} >
                                  {task.title}
                                </button></>
                          }
                        </>
                      }
                    </li>)
                }
                {
                  tdlList?.length === 0 && <li className="no-data">No Data</li>
                }
              </ul>
            </div>
        }
      </div >
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button disabled={isLoadingTdl}>Charts</button>
        </div>
        <div className="chartWrapper">
          {
            isLoadingTdl ? <div className="loader">Loading...</div> :
              <>
                <DataChart type={{ property: "category", items: "tasks" }} data={dataTdl} isLoading={isLoadingTdl} />
                <DataChart type={{ property: "status", items: "tasks" }} data={dataTdl} isLoading={isLoadingTdl} />
                <DataChart type={{ property: "priority", items: "tasks" }} data={dataTdl} isLoading={isLoadingTdl} />
              </>
          }
        </div>
      </div>
    </>
  )
}
