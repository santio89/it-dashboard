import { useEffect, useRef, useState } from 'react'
import { useGetTdlQuery, useEditTdlMutation, useGetTdlNextQuery, useSetTdlMutation, useSetSupportMutation } from '../store/slices/apiSlice'
import { setFilters } from '../store/slices/themeSlice'
import { setModal } from '../store/slices/modalSlice'
import { useDispatch, useSelector } from 'react-redux'
import DataChart from './DataChart'
import autoAnimate from "@formkit/auto-animate";
import { useTranslation } from '../hooks/useTranslation'
import { toast } from 'sonner'
import Dropdown from './Dropdown'

const formFields = ["author", "title", "description", "priority", "status"]

export default function Tasks({ user }) {
  const lang = useTranslation()

  const dispatch = useDispatch()

  const [listPickerOpen, setListPickerOpen] = useState(false)
  const listSelected = useSelector(state => state.theme.filters.tasks.list)
  const [sortList, setSortList] = useState(false)


  const [taskOptions, setTaskOptions] = useState(null)

  const [tasksList, setTasksList] = useState(null)
  const [firstLoad, setFirstLoad] = useState(null)

  const [lastVisible, setLastVisible] = useState(null)

  const [graphicPickerOpen, setGraphicPickerOpen] = useState(false)
  const graphicSelected = useSelector(state => state.theme.filters.tasks.charts)

  const listContainer = useRef()
  const chartContainer = useRef()

  const [editTdl, resultEditTdl] = useEditTdlMutation()
  const [setTdl, resultSetTdl] = useSetTdlMutation()

  const {
    data: { tasks: dataTasks, lastVisible: dataLastVisible } = {},
    isLoading: isLoadingTasks,
    isFetching: isFetchingTasks,
    isSuccess: isSuccessTasks,
    isError: isErrorTasks,
    error: errorTasks,
  } = useGetTdlQuery(user.uid);


  useGetTdlNextQuery({ userId: user?.uid, lastVisible });

  const handleRefetch = () => {
    setLastVisible(dataLastVisible)
  }

  const selectList = list => {
    dispatch(setFilters({
      filters: {
        tasks: {
          list: list
        }
      }
    }))
  }

  const selectGraphic = graphic => {
    if (graphic === "none") {
      dispatch(setFilters({
        filters: {
          tasks: {
            charts: []
          }
        }
      }))
      return
    }

    if (graphic === "all") {
      dispatch(setFilters({
        filters: {
          tasks: {
            charts: [...formFields]
          }
        }
      }))
      return
    }

    if (graphicSelected.includes(graphic)) {
      dispatch(setFilters({
        filters: {
          tasks: {
            charts: graphicSelected.filter(graph => graph != graphic)
          }
        }
      }))
      return
    }

    dispatch(setFilters({
      filters: {
        tasks: {
          charts: [...graphicSelected, graphic]
        }
      }
    }))
  }

  const editStatusFn = async (task) => {
    if (resultEditTdl.isLoading || isFetchingTasks) {
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

  const setTdlFn = async (data) => {
    await setTdl(data)
  }

  /* order */
  useEffect(() => {
    if (dataTasks) {
      /* filter */
      const filteredList = dataTasks?.filter(item => {
        return (listSelected === "all" || item.status === listSelected)
      })

      /* sort */
      let orderedList = []

      if (sortList) {
        orderedList = [...filteredList].sort((a, b) => a.localTime - b.localTime);
      } else {
        orderedList = [...filteredList].sort((a, b) => b.localTime - a.localTime);
      }

      setTasksList(orderedList)
    }
  }, [dataTasks, sortList, listSelected])

  /* realtime updates -> disabled (too much read quota) */
  /* useEffect(() => {
    let firstSnapshot = true;
    const collectionRef = collection(db, "authUsersData", user.uid, "tdl")

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

      setTdlFn(handleArray)
    })
  }, [user]) */

  /* useEffect(() => {
    taskOptions && setTaskOptions(null)
  }, [listSelected]) */

  useEffect(() => {
    !isLoadingTasks && tasksList && listContainer.current && autoAnimate(listContainer.current)
    !isLoadingTasks && tasksList && chartContainer.current && autoAnimate(chartContainer.current)
  }, [listContainer, chartContainer, isLoadingTasks, tasksList])

  useEffect(() => {
    let timeout;

    if (!isLoadingTasks) {
      timeout = setTimeout(() => {
        setFirstLoad(false)
      }, 0)
    } else {
      setFirstLoad(true)
    }

    return () => clearTimeout(timeout)
  }, [isLoadingTasks])

  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button disabled={isLoadingTasks} onClick={() => {
            dispatch(setModal({ active: true, data: { modalType: "TasksDataModal", newTask: true, userId: user?.uid, user: user } }))
          }}>+ {lang.addTask}</button>
          <div className="listPickerWrapper">
            <div className="listPickerWrapper__btnContainer">
              {
                <button disabled={isLoadingTasks} className={`listPicker filter ${listPickerOpen && "selected"}`} onClick={() => setListPickerOpen(listPickerOpen => !listPickerOpen)}>{lang.filter}</button>
              }
              {
                listPickerOpen &&
                <Dropdown dropdownOpen={listPickerOpen} setDropdownOpen={setListPickerOpen} direction="row" anchor="right">
                  <button disabled={isLoadingTasks} className={`dropdownBtn ${listSelected === "completed" && "selected"}`}
                    onClick={() => {
                      selectList("completed")
                    }}>
                    {lang.completed}
                  </button>
                  <button disabled={isLoadingTasks} className={`dropdownBtn ${listSelected === "pending" && "selected"}`}
                    onClick={() => {
                      selectList("pending")
                    }}>
                    {lang.pending}
                  </button>
                  <button disabled={isLoadingTasks} className={`dropdownBtn ${listSelected === "all" && "selected"}`}
                    onClick={() => {
                      selectList("all")
                    }}>
                    {lang.all}
                  </button>
                </Dropdown>
              }
            </div>
          </div>
        </div>
        <div className="sortBtn">
          <button disabled={isLoadingTasks} onClick={() => setSortList(sortList => !sortList)}>
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
          isLoadingTasks ? <div className="loader">{lang.loading}...</div> :
            <div className="listWrapper">
              <ul className='tdl-list' ref={listContainer}>
                {
                  tasksList?.length === 0 ? <li className="no-data">{lang.noData}</li> :
                    <>
                      {
                        tasksList?.map((task) =>
                          <li key={task.localId} className={`${task.priority === "low" && "selectedLow"} ${task.priority === "medium" && "selectedMedium"} ${task.priority === "high" && "selectedHigh"} ${firstLoad && "firstLoad"}`}>
                            {/* task options */}
                            {
                              taskOptions === task.id &&
                              <div className='tdl-btnContainer' onClick={() => {
                                setTaskOptions(null)
                              }}>
                                {/* task status */}
                                <div className={`tdl-itemData`} title={`${lang.status}: ${lang[task.status] ?? lang.pending}`} onClick={(e) => {
                                  e.stopPropagation();
                                  setListPickerOpen(false);
                                  setGraphicPickerOpen(false);
                                  if (task.id === "temp-id") return
                                  editStatusFn(task)
                                }}>
                                  {<>
                                    <span>{lang.completed}:</span>
                                    <button>
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
                                    <button disabled={task.id === "temp-id"} title={lang.info} onClick={(e) => { e.stopPropagation(); dispatch(setModal({ active: true, data: { modalType: "TasksDataModal", tasksData: true, user: user, ...task } })) }}>
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
                                        {task.description || "-"}
                                      </div>
                                    </> :
                                    <>
                                      <button disabled={task.id === "temp-id"} title={task.title} className={`taskContentBtn ${taskOptions !== task.id && task.priority === "low" && "selectedLow"} ${taskOptions !== task.id && task.priority === "medium" && "selectedMedium"} ${taskOptions !== task.id && task.priority === "high" && "selectedHigh"} ${taskOptions === task.id && "taskOption"} ${task.status === "completed" && "taskCompleted"}`} onClick={() => {
                                        setTaskOptions(task.id);
                                      }} >
                                        <span className="taskContentBtn__title">{task.title}</span>
                                      </button></>
                                }
                              </>
                            }
                          </li>)
                      }
                    </>
                }
              </ul>
              <div className="listWrapper__loadMore">
                <div>{lang.showing}: {tasksList?.length} - {lang.total}: {dataTasks?.length}</div>
                {<button onClick={handleRefetch} disabled={!dataLastVisible}>{dataLastVisible ? `${lang.loadMore}...` : lang.allLoaded}</button>}
              </div>
            </div>
        }
      </div >
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button className={`${graphicPickerOpen && "selected"}`} disabled={isLoadingTasks} onClick={() => { setGraphicPickerOpen(graphicPickerOpen => !graphicPickerOpen) }}>{lang.charts}</button>
          {
            graphicPickerOpen &&
            <Dropdown dropdownOpen={graphicPickerOpen} setDropdownOpen={setGraphicPickerOpen} direction="column" anchor="left">
              {formFields.map((field) => {
                return <button key={field} disabled={isLoadingTasks} className={`dropdownBtn ${graphicSelected.includes(field) && "selected"}`}
                  onClick={() => {
                    selectGraphic(field)
                  }}>
                  {
                    lang[field]
                  }
                </button>
              })}
              <button key={"graphPickerBtn-none"} disabled={isLoadingTasks} className={`dropdownBtn ${graphicSelected.length === 0 && "selected"}`}
                onClick={() => {
                  selectGraphic("none")
                }}>
                {
                  lang["none"]
                }
              </button>
              <button key={"graphPickerBtn-all"} disabled={isLoadingTasks} className={`dropdownBtn ${graphicSelected.length === formFields.length && "selected"}`}
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
          isLoadingTasks ? <div className="loader">{lang.loading}...</div> :
            <div className="chartWrapper">
              <ul className="charts-list" ref={chartContainer}>
                {
                  graphicSelected?.length === 0 ?
                    <li>{lang.noChartsSelected}</li> :
                    graphicSelected?.map((graphic) => {
                      return <DataChart key={graphic} type={{ property: graphic, items: "tasks" }} data={dataTasks} firstLoad={firstLoad} />
                    })
                }
              </ul>
            </div>
        }
      </div>
    </>
  )
}
