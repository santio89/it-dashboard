import { useEffect, useRef, useState } from 'react'
import { useGetTdlQuery, useDeleteTdlMutation, useEditTdlMutation } from '../store/slices/apiSlice'
import { setModal } from '../store/slices/modalSlice'
import { useDispatch } from 'react-redux'
import DataChart from './DataChart'
import autoAnimate from "@formkit/auto-animate";

export default function TDL({ user }) {
  const [taskOptions, setTaskOptions] = useState(null)
  const [editMode, setEditMode] = useState(null)
  const [deleteMode, setDeleteMode] = useState(null)
  const [editInputText, setEditInputText] = useState("")
  const editInput = useRef()
  const dispatch = useDispatch()
  const listContainer = useRef()

  /* search */
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")


  /* edit opts */
  const [editPriority, setEditPriority] = useState(null)
  const [editCategory, setEditCategory] = useState(null)


  const [deleteTdl, resultDeleteTdl] = useDeleteTdlMutation()
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


  const deleteTask = async (task) => {
    if (resultDeleteTdl.isLoading) {
      return
    }

    await deleteTdl(task)

    /* timeout-refetch */
    setTimeout(() => {
      setEditMode(null)
    }, 400)
  }

  const editTask = async (task, input, priority, category) => {
    0
    if (resultEditTdl.isLoading) {
      return
    }

    if ((input.trim() === "" || input.trim() === task.content) && (task.priority === (priority ?? task.priority)) && (task.category === (category ?? task.category))) {
      setEditMode(null)
      return
    }

    const newTask = { ...task, content: input.trim(), category: category ?? task.category, priority: priority ?? task.priority }
    await editTdl(newTask)

    /* timeout-refetch */
    setTimeout(() => {
      setEditMode(null)
    }, 400)
  }

  const editTaskPriorityFn = async (task, priority) => {
    if (priority === task.priority) {
      setEditPriority(null)
      return
    }

    setEditPriority(priority)
  }

  const editCategoryFn = async (task, category) => {
    if (category === task.priority) {
      setEditCategory(null)
      return
    }

    setEditCategory(category)
  }

  useEffect(() => {
    setEditPriority(null)
    setEditCategory(null)
    editMode && editInput.current.focus()
  }, [editMode])

  useEffect(() => {
    setEditMode(null)
    setDeleteMode(null)
    setEditInputText("")
  }, [taskOptions])

  useEffect(() => {
    taskOptions && setTaskOptions(null)
  }, [listSelected])

  useEffect(() => {
    !isLoadingTdl && listContainer.current && autoAnimate(listContainer.current)
  }, [listContainer, isLoadingTdl])

  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button onClick={() => {
            dispatch(setModal({ active: true, data: { modalType: "TDLDataModal", newTask: true, userId: user?.uid } }))
            setListPickerOpen(false)
          }}>+ Add task</button>
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
          isLoadingTdl ? <div className="loader">Loading...</div> :
            <ul className='tdl-list' ref={listContainer}>        {
              dataTdl?.map((task) => {
                if (listSelected === "all" || listSelected === task.category) {
                  return (
                    <li key={task.id} disabled={taskOptions === task.id && (resultEditTdl.isLoading || resultDeleteTdl.isLoading)}>
                      {/* task options */}
                      {
                        taskOptions === task.id &&
                        <div className='tdl-btnContainer'>
                          <div className={`tdl-openModal ${editMode === task.id && "editPriority"}`}>
                            {
                              editMode === task.id ?
                                <>
                                  <button onClick={() => editTaskPriorityFn(task, "low")} title='Task priority: low' className={`tdl-priority selectedLow ${((!editPriority && task.priority === "low") || editPriority === "low") && "selected"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                    </svg>
                                  </button>
                                  <button onClick={() => editTaskPriorityFn(task, "medium")} title='Task priority: medium' className={`tdl-priority selectedMedium ${((!editPriority && task.priority === "medium") || editPriority === "medium") && "selected"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                    </svg>
                                  </button>
                                  <button onClick={() => editTaskPriorityFn(task, "high")} title='Task priority: high' className={`tdl-priority selectedHigh ${((!editPriority && task.priority === "high") || editPriority === "high") && "selected"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                    </svg>
                                  </button>
                                </> :
                                <>
                                  <button title={`Task priority: ${task.priority}`} className={`tdl-priority ${task.priority === "low" && "selectedLow"} ${task.priority === "medium" && "selectedMedium"} ${task.priority === "high" && "selectedHigh"}`}
                                    onClick={() => {
                                      /* ADD HINT */
                                    }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                    </svg>
                                  </button>
                                </>
                            }
                            {editMode !== task.id &&
                              <>
                                <button onClick={() => { dispatch(setModal({ active: true, data: { modalType: "TDLDataModal", tdlData: true, ...task } })); setListPickerOpen(false) }}>{"Open"}</button>
                              </>
                            }

                          </div>
                          <div className={`tdl-optionsBtns`}>
                            {
                              editMode === task.id || deleteMode === task.id ?
                                <button onClick={() => {
                                  setEditMode(null)
                                  setDeleteMode(null)
                                }}>{"Cancel"}
                                </button> :
                                <button onClick={() => {
                                  setEditMode(task.id)
                                  setEditInputText(task.content)
                                }}>{"Edit"}
                                </button>
                            }
                            {
                              editMode === task.id || deleteMode === task.id ?
                                <button onClick={() => {
                                  deleteMode === task.id && deleteTask(task)
                                  editMode === task.id && editTask(task, editInputText, editPriority, editCategory)
                                }}>{"Confirm"}
                                </button> :

                                <button onClick={() => {
                                  setDeleteMode(task.id)
                                }}>{"Delete"}
                                </button>
                            }
                          </div>
                        </div>
                      }

                      {/* task / taskOptions */}
                      {
                        deleteMode !== task.id && editMode !== task.id &&
                        <button title="task"
                          className={`taskContentBtn ${taskOptions !== task.id && task.priority === "low" && "selectedLow"} ${taskOptions !== task.id && task.priority === "medium" && "selectedMedium"} ${taskOptions !== task.id && task.priority === "high" && "selectedHigh"} ${taskOptions === task.id && "taskOption"}`}
                          onClick={() => {
                            if (taskOptions === task.id) {
                              setTaskOptions(null)
                            } else {
                              setTaskOptions(task.id)
                            }
                          }}>
                          {task.content}
                        </button>
                      }

                      {/* edit task */}
                      {
                        editMode === task.id && <textarea disabled={resultEditTdl.isLoading} ref={editMode === task.id && editInput} title={"Task"} spellCheck={false} value={editInputText} onKeyPress={e => {
                          if (!e.shiftKey) {
                            return
                          }
                          if (e.key === "Enter" && e.shiftKey) {
                            e.preventDefault();
                            editTask(task, editInputText, editPriority, editCategory)
                          }
                        }} onChange={e => setEditInputText(e.target.value)} className={`taskOption editMode`} placeholder='Task'></textarea>
                      }

                      {/* delete task */}
                      {
                        deleteMode === task.id && <button title={"Task"} className={`taskContentBtn taskOption deleteMode`} >{task.content}</button>
                      }

                      {/* task category */}
                      {
                        taskOptions === task.id &&
                        <div className="listPickerWrapper">
                          <div className="listPickerWrapper__btnContainer">
                            {
                              editMode === task.id ?
                                <>
                                  <button className={`listPicker ${editMode && "pickerOpen"} ${((!editCategory && task.category === "personal") || editCategory === "personal") && "selected"}`} onClick={() => { editCategoryFn(task, "personal") }}>Personal</button>
                                  <button className={`listPicker ${editMode && "pickerOpen"} ${((!editCategory && task.category === "company") || editCategory === "company") && "selected"}`} onClick={() => { editCategoryFn(task, "company") }}>Company</button>
                                </>
                                :
                                <button title={`Task category: ${task.category}`} className={`listPicker ${editMode && "pickerOpen"}`} onClick={() => { /* ADD HINT */ }}>{task.category}</button>
                            }
                            {
                            }
                          </div>
                        </div>
                      }
                    </li>)
                }
              }
              )
            }
            </ul>
        }
      </div>
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button>Tasks by category</button>
        </div>
        <div className="chartWrapper">
          <DataChart type={{ property: "category", items: "tasks" }} data={dataTdl} isLoading={isLoadingTdl} />
        </div>
      </div>
    </>
  )
}
