import { useEffect, useRef, useState } from 'react'
import { useGetTdlQuery, useAddTdlMutation, useDeleteTdlMutation, useEditTdlMutation } from '../store/slices/apiSlice'
import { setModal } from '../store/slices/modalSlice'
import { useDispatch } from 'react-redux'
import TDLChart from './TDLChart'
import autoAnimate from '@formkit/auto-animate'

export default function TDL({ user }) {
  const parentAnimateTDL = useRef()

  const [inputActive, setInputActive] = useState(false)
  const [taskOptions, setTaskOptions] = useState(null)
  const [editMode, setEditMode] = useState(null)
  const [deleteMode, setDeleteMode] = useState(null)
  const [editInputText, setEditInputText] = useState("")
  const [taskPriorityOpts, setTaskPriorityOpts] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState("medium")

  const textInput = useRef()
  const editInput = useRef()
  const dispatch = useDispatch()

  /* search */
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")

  /* new input */
  const [newListPickerOpen, setNewListPickerOpen] = useState(false)
  const [newListSelected, setNewListSelected] = useState(listSelected == "all" ? "personal" : listSelected)

  /* edit opts */
  const [editPriority, setEditPriority] = useState(null)
  const [editCategory, setEditCategory] = useState(null)


  const [addTdl, resultAddTdl] = useAddTdlMutation()
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

  const selectNewList = list => {
    setNewListSelected(list)
    setNewListPickerOpen(false)
  }

  const addTask = () => {
    if (textInput.current.textContent.trim() === "") {
      setInputActive(false)
      return
    }
    const task = {
      userId: user.uid,
      content: textInput.current.textContent.trim(),
      priority: selectedPriority,
      category: newListSelected
    }

    addTdl(task)
  }

  const deleteTask = async (task) => {
    await deleteTdl(task)
    /* timeout-refetch */
    setTimeout(() => {
      setEditMode(null)
    }, 400)
  }

  const editTask = async (task, input, priority, category) => {
    if ((input.trim() === "" || input.trim() === task.content) && (task.priority === priority) && (task.category === category)) {
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
    setSelectedPriority("medium")
    setTaskPriorityOpts(false)
    setNewListPickerOpen(false)
    setNewListSelected(listSelected == "all" ? "personal" : listSelected)
    if (inputActive) {
      textInput.current.textContent = ""
      setTaskOptions(null)
      textInput.current.focus()
    }
  }, [inputActive])

  useEffect(() => {
    setEditPriority(null)
    setEditCategory(null)
    editMode && editInput.current.focus()
  }, [editMode])

  useEffect(() => {
    setEditMode(null)
    setDeleteMode(null)
    /*     setEditTaskPriority(null) */
    setEditInputText("")
    /*     setEditListPickerOpen(null) */
    taskOptions && setInputActive(false)
  }, [taskOptions])

  useEffect(() => {
    taskOptions && setTaskOptions(null)
  }, [listSelected])

  useEffect(() => {
    if (!resultAddTdl.isLoading) {
      setSelectedPriority("medium")
      setTaskPriorityOpts(false)
      setNewListPickerOpen(false)
      setNewListSelected(listSelected == "all" ? "personal" : listSelected)
      if (inputActive) {
        textInput.current.textContent = ""
        textInput.current.focus()
      }
    }
  }, [resultAddTdl])

  useEffect(() => {
    !isFetchingTdl && parentAnimateTDL.current && autoAnimate(parentAnimateTDL.current)
  }, [parentAnimateTDL, isFetchingTdl])

  return (
    <div className='site-section'>
      <div className="site-section__inner site-section__tdl">
        <div className="tdl-input">
          <div className="btnWrapper tdl-input__btns">
            <div className='tdl-input__btns__inner'>
              <button onClick={() => setInputActive(!inputActive)}>{inputActive ? "Cancel" : "+ Add task"}</button>
              {inputActive && <button onClick={() => { addTask() }}>Send</button>}

            </div>
            <div className="listPickerWrapper">
              <div className="listPickerWrapper__btnContainer">
                {
                  <button className={`listPicker ${listPickerOpen && "selected"}`} onClick={() => listPickerOpen ? setListPickerOpen(false) : setListPickerOpen(true)}>{listSelected}</button>
                }
                {
                  listPickerOpen &&
                  <div className="listPickerOptions">
                    <button className={`listPicker notSelected`}
                      onClick={() => {
                        selectList("personal")
                        setNewListSelected("personal")
                      }}>
                      Personal
                    </button>
                    <button className={`listPicker notSelected`}
                      onClick={() => {
                        selectList("company")
                        setNewListSelected("company")
                      }}>
                      Company
                    </button>
                    <button className={`listPicker notSelected`}
                      onClick={() => {
                        selectList("all")
                        setNewListSelected("personal")
                      }}>
                      All
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
          {
            inputActive &&
            <div className='tdl-input__content' disabled={resultAddTdl.isLoading}>
              <div className="tdl-input__content__priority">
                <button title={`Task priority: ${selectedPriority}`} className={`${taskPriorityOpts && "selected"} ${selectedPriority === "low" && "selectedLow"} ${selectedPriority === "medium" && "selectedMedium"} ${selectedPriority === "high" && "selectedHigh"}`} onClick={() => setTaskPriorityOpts(taskPriorityOpts => !taskPriorityOpts)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                </button>
                {taskPriorityOpts &&
                  <div className="tdl-input__content__priority__opts">
                    <button onClick={() => { setSelectedPriority("low"); setTaskPriorityOpts(false) }} className={`${selectedPriority === "low" && "selected"}`} title='Task priority: low'>Low</button>
                    <button onClick={() => { setSelectedPriority("medium"); setTaskPriorityOpts(false) }} className={`${selectedPriority === "medium" && "selected"}`} title='Task priority: Medium'>Medium</button>
                    <button onClick={() => { setSelectedPriority("high"); setTaskPriorityOpts(false) }} className={`${selectedPriority === "high" && "selected"}`} title='Task priority: High'>High</button>
                  </div>
                }
              </div>

              <div aria-label='textarea' className='textarea-input' contentEditable={!resultAddTdl.isLoading} ref={textInput} spellCheck={false} placeholder='Task' onKeyPress={e => {
                if (e.shiftKey && e.key === "Enter") {
                  return
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTask()
                  return
                }

              }}></div>

              <div className="listPickerWrapper">
                <div className="listPickerWrapper__btnContainer">
                  {
                    <button className={`listPicker ${listPickerOpen && "pickerOpen"}`} onClick={() => newListPickerOpen ? setNewListPickerOpen(false) : setNewListPickerOpen(true)}>{newListSelected}</button>
                  }
                  {
                    newListPickerOpen &&
                    <div className="listPickerOptions">
                      <button className={`listPicker ${newListPickerOpen && "pickerOpen"}`}
                        onClick={() => {
                          selectNewList(newListSelected === "personal" ? "company" : "personal")
                        }}>
                        {newListSelected === "personal" ? "Company" : "Personal"}
                      </button>
                      <button className={`listPicker ${newListPickerOpen && "pickerOpen"} selected`}
                        onClick={() => {
                          setNewListPickerOpen(false)
                        }}>
                        {newListSelected}
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
        {
          isLoadingTdl ? "Loading..." :
            <ul className='tdl-list' ref={parentAnimateTDL}>
              {
                dataTdl?.map((task) => {
                  if (listSelected === "all" || listSelected === task.category) {
                    return (
                      <li key={task.id} disabled={taskOptions === task.id && (resultEditTdl.isLoading || resultDeleteTdl.isLoading || isFetchingTdl)}>
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
                                  <button onClick={() => { dispatch(setModal({ active: true, data: { tdlData: true, ...task } })); setListPickerOpen(false) }}>{"Open"}</button>
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

                        {/* task */}
                        {
                          deleteMode !== task.id && editMode !== task.id && taskOptions !== task.id && <button title={"Task"} className={`taskContentBtn  ${task.priority === "low" && "selectedLow"} ${task.priority === "medium" && "selectedMedium"} ${task.priority === "high" && "selectedHigh"}`} onClick={() => { taskOptions === task.id ? setTaskOptions(null) : setTaskOptions(task.id) }}>{task.content}</button>
                        }

                        {/* task selected */}
                        {
                          taskOptions === task.id && deleteMode !== task.id && editMode !== task.id && <button title={"Task"} className={`taskContentBtn taskOption`} onClick={() => { taskOptions === task.id ? setTaskOptions(null) : setTaskOptions(task.id) }}>{task.content}</button>
                        }

                        {/* edit task */}
                        {
                          editMode === task.id && <textarea disabled={resultEditTdl.isLoading} ref={editMode === task.id && editInput} title={"Task"} spellCheck={false} value={editInputText} onKeyPress={e => {
                            if (e.shiftKey) {
                              return
                            }
                            if (e.key === "Enter") {
                              e.preventDefault();
                              editTask(task, editInputText)
                            }
                          }} onChange={e => setEditInputText(e.target.value)} className={`taskOption editMode`} placeholder='Task'></textarea>
                        }

                        {/* delete task */}
                        {
                          deleteMode === task.id && <button title={"Task"} className={`taskContentBtn taskOption deleteMode`} onClick={() => { taskOptions === task.id ? setTaskOptions(null) : setTaskOptions(task.id) }}>{task.content}</button>
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
                                  <button className={`listPicker ${editMode && "pickerOpen"}`} onClick={() => { /* ADD HINT */ }}>{task.category}</button>
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
          <TDLChart data={dataTdl} isLoading={isFetchingTdl} />
        </div>
      </div>
    </div >
  )
}
