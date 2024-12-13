import { useEffect, useRef, useState } from 'react'
import { useGetTdlQuery, useDeleteTdlMutation, useEditTdlMutation } from '../store/slices/apiSlice'
import { setModal } from '../store/slices/modalSlice'
import { useDispatch } from 'react-redux'
import DataChart from './DataChart'
import autoAnimate from "@formkit/auto-animate";

export default function TDL({ user }) {
  const dispatch = useDispatch()
  const [sortList, setSortList] = useState(false)
  const [taskOptions, setTaskOptions] = useState(null)
  const [editMode, setEditMode] = useState(null)
  const [deleteMode, setDeleteMode] = useState(null)
  const editInput = useRef()
  const listContainer = useRef()

  const [tdlList, setTdlList] = useState(null)

  /* search */
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")


  /* edit opts inputs */
  const [editInputText, setEditInputText] = useState(null)
  const [editInputTitle, setEditInputTitle] = useState(null)

  /* edit opts btns */
  const [editPriority, setEditPriority] = useState(null)
  const [editCategory, setEditCategory] = useState(null)
  const [editStatus, setEditStatus] = useState(null)


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

  const trimInputs = () => {
    setEditInputText(editInputText => editInputText.trim())
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

  const editTask = async (task, title, input, priority, category, status) => {
    if (resultEditTdl.isLoading) {
      return
    }

    if (title.trim() === "") {
      return
    }

    if (input.trim() === task.content && (task.title === (title ?? task.title)) && (task.priority === (priority ?? task.priority)) && (task.category === (category ?? task.category)) && (task.status === (status ?? task.status))) {
      setEditMode(null)
      return
    }

    const newTask = { ...task, content: input.trim(), title: title ?? task.title, category: category ?? task.category, priority: priority ?? task.priority, status: status ?? task.status }
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
    if (category === task.category) {
      setEditCategory(null)
      return
    }

    setEditCategory(category)
  }

  const editStatusFn = async (task, status) => {
    if (status === task.status) {
      setEditStatus(null)
      return
    }

    setEditStatus(status)
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
        orderedList = [...filteredList].sort((a, b) => a.createdAt.toDate() - b.createdAt.toDate());
      } else {
        orderedList = [...filteredList].sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      }

      setTdlList(orderedList)
    }
  }, [sortList, listSelected, dataTdl])

  useEffect(() => {
    taskOptions && setTaskOptions(null)
  }, [listSelected])

  useEffect(() => {
    setEditMode(null)
    setDeleteMode(null)
  }, [taskOptions])

  useEffect(() => {
    if (editMode) {
      /* replace for title ref */
      editMode && editInput.current.focus()
    } else {
      setEditInputText(null)
      setEditInputTitle(null)
      setEditPriority(null)
      setEditCategory(null)
      setEditStatus(null)
    }
  }, [editMode])

  useEffect(() => {
    !isLoadingTdl && tdlList && listContainer.current && autoAnimate(listContainer.current)
  }, [listContainer, isLoadingTdl, tdlList])

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
                <button className={`listPicker filter ${listPickerOpen && "selected"}`} onClick={() => listPickerOpen ? selectList(listSelected) : setListPickerOpen(true)}>Filter</button>
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
        <div className="sortBtn">
          <button onClick={() => setSortList(sortList => !sortList)}>
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
                    <li key={task.id} disabled={taskOptions === task.id && (resultEditTdl.isLoading || resultDeleteTdl.isLoading)}>
                      {/* close btn */}
                      {taskOptions === task.id &&
                        <button className='taskOptionsClose' onClick={() => {
                          if (taskOptions === task.id) {
                            setTaskOptions(null)
                          } else {
                            setTaskOptions(task.id)
                          }
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                          </svg>
                        </button>
                      }
                      {/* task options */}
                      {
                        taskOptions === task.id &&
                        <div className='tdl-btnContainer'>
                          <div className={`tdl-itemData ${editMode === task.id && "editPriority"}`}>
                            {
                              editMode === task.id ?
                                <>
                                  <div className="editBtnWrapper">
                                    <button title={"Priority: low"} onClick={() => editTaskPriorityFn(task, "low")} className={`tdl-priority selectedLow ${((!editPriority && task.priority === "low") || editPriority === "low") && "selected"}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                      </svg>
                                    </button>
                                    <button title={"Priority: medium"} onClick={() => editTaskPriorityFn(task, "medium")} className={`tdl-priority selectedMedium ${((!editPriority && task.priority === "medium") || editPriority === "medium") && "selected"}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                      </svg>
                                    </button>
                                    <button title={"Priority: high"} onClick={() => editTaskPriorityFn(task, "high")} className={`tdl-priority selectedHigh ${((!editPriority && task.priority === "high") || editPriority === "high") && "selected"}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                      </svg>
                                    </button>
                                  </div>

                                  <div className="btnContainer-separator"></div>

                                  <div className="editBtnWrapper">
                                    {/* personal */}
                                    <button title={"Category: personal"} className={` ${editMode && "pickerOpen"} ${((!editCategory && task.category === "personal") || editCategory === "personal") && "selected"}`} onClick={() => { editCategoryFn(task, "personal") }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-person" viewBox="0 0 16 16">
                                      <path d="M12 1a1 1 0 0 1 1 1v10.755S12 11 8 11s-5 1.755-5 1.755V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                      <path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                    </svg></button>

                                    {/* company */}
                                    <button title={"Category: company"} className={` ${editMode && "pickerOpen"} ${((!editCategory && task.category === "company") || editCategory === "company") && "selected"}`} onClick={() => { editCategoryFn(task, "company") }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-building" viewBox="0 0 16 16">
                                      <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
                                      <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z" />
                                    </svg></button>

                                  </div>

                                  <div className="btnContainer-separator"></div>

                                  <div className="editBtnWrapper">
                                    {/* not done */}
                                    <button title={"Status: not done"} className={` ${editMode && "pickerOpen"} ${((!editStatus && task.status === "not done") || editStatus === "not done") && "selected"}`} onClick={() => { editStatusFn(task, "not done") }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-square" viewBox="0 0 16 16">
                                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                    </svg></button>

                                    {/* done */}
                                    <button title={"Status: done"} className={` ${editMode && "pickerOpen"} ${((!editStatus && task.status === "done") || editStatus === "done") && "selected"}`} onClick={() => { editStatusFn(task, "done") }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
                                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                      <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                    </svg></button>
                                  </div>

                                  <div className="btnContainer-separator"></div>
                                </> :
                                <>
                                  <button className={`tdl-priority ${task.priority === "low" && "selectedLow"} ${task.priority === "medium" && "selectedMedium"} ${task.priority === "high" && "selectedHigh"}`} title={`Priority: ${task.priority}`}
                                    onClick={() => {
                                      /* ADD HINT */
                                    }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                    </svg>
                                  </button>
                                  {
                                    <div className="btnContainer-separator"></div>
                                  }
                                  <button title={`Category: ${task.category}`} className={` ${editMode && "pickerOpen"}`} onClick={() => { /* ADD HINT */ }}>
                                    {task.category === "personal" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-person" viewBox="0 0 16 16">
                                      <path d="M12 1a1 1 0 0 1 1 1v10.755S12 11 8 11s-5 1.755-5 1.755V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                      <path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                    </svg>}
                                    {task.category === "company" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-building" viewBox="0 0 16 16">
                                      <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
                                      <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z" />
                                    </svg>}
                                  </button>
                                  {
                                    <div className="btnContainer-separator"></div>
                                  }
                                  <button title={`Status: ${task.status}`} className={` ${editMode && "pickerOpen"}`} onClick={() => { /* ADD HINT */ }}>
                                    {task.status === "done" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
                                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                      <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                    </svg>}
                                    {task.status === "not done" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-square" viewBox="0 0 16 16">
                                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                    </svg>}
                                  </button>
                                  {
                                    <div className="btnContainer-separator"></div>
                                  }
                                </>
                            }
                          </div>
                          <div className={`tdl-optionsBtns`}>
                            {
                              <div className="btnContainer-separator"></div>}
                            {
                              editMode === task.id || deleteMode === task.id ?
                                /* cancel */
                                <button title={"Cancel"} onClick={() => {
                                  setEditMode(null)
                                  setDeleteMode(null)
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                  </svg>
                                </button> :
                                /* edit */
                                <button title={"Edit"} onClick={() => {
                                  setEditMode(task.id)
                                  setEditInputText(task.content)
                                  setEditInputTitle(task.title)
                                  setEditPriority(task.priority)
                                  setEditCategory(task.category)
                                  setEditStatus(task.status)
                                }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                  </svg>
                                </button>
                            }
                            {
                              editMode === task.id || deleteMode === task.id ?
                                /* confirm */
                                <button title={"Confirm"} onClick={() => {
                                  trimInputs()
                                  deleteMode === task.id && deleteTask(task)
                                  editMode === task.id && editTask(task, editInputTitle, editInputText, editPriority, editCategory, editStatus)
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg confirm" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                  </svg>
                                </button> :
                                /* delete */
                                <button title={"Delete"} onClick={() => {
                                  setDeleteMode(task.id)
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                  </svg>
                                </button>
                            }
                            {
                              <div className="btnContainer-separator"></div>
                            }
                            {
                              /* open */
                              < button title={"Info"} onClick={() => { setEditMode(null), setDeleteMode(null), dispatch(setModal({ active: true, data: { modalType: "TDLDataModal", tdlData: true, ...task } })); setListPickerOpen(false) }}>
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
                        deleteMode !== task.id && editMode !== task.id &&
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
                                <button title={task.title} className={`taskContentBtn ${taskOptions !== task.id && task.priority === "low" && "selectedLow"} ${taskOptions !== task.id && task.priority === "medium" && "selectedMedium"} ${taskOptions !== task.id && task.priority === "high" && "selectedHigh"} ${taskOptions === task.id && "taskOption"} ${task.status === "done" && "taskDone"}`} onClick={() => setTaskOptions(task.id)} >
                                  {task.title}
                                </button></>
                          }
                        </>
                      }

                      {/* edit task */}
                      {
                        editMode === task.id &&
                        <>
                          <div className='taskContentTitle editMode'> <input ref={editMode === task.id && editInput} placeholder='Title (required)' spellCheck={false} type="text" value={editInputTitle} onChange={e => setEditInputTitle(e.target.value)} maxLength={200} required /></div>
                          <textarea placeholder='Description' disabled={resultEditTdl.isLoading} spellCheck={false} value={editInputText} onChange={e => setEditInputText(e.target.value)} className={`taskOption editMode`}>
                          </textarea>
                        </>

                      }

                      {/* delete task */}
                      {
                        deleteMode === task.id &&
                        <>
                          <div className='taskContentTitle deleteMode'>{task.title}</div>
                          <div className={`taskContentBtn taskOption deleteMode`}>{task.content || "-"}</div>
                        </>
                      }
                    </li>)
                }
                {
                  tdlList?.length === 0 && <li>No Data</li>
                }
              </ul>
            </div>
        }
      </div >
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
