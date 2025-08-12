import { useState, useEffect } from "react";
import Dropdown from "./Dropdown"
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useTranslation } from "../hooks/useTranslation";
import { setFilters } from "../store/slices/themeSlice";

function SectionBtnWrapper({ section, user, data, isLoadingData, setDataList }) {
  const lang = useTranslation()
  const dispatch = useDispatch()
  const listSelected = useSelector(state => state.theme.filters[section].list)
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [sortList, setSortList] = useState(false)

  let addBtn;
  let modalType;
  switch (section) {
    case 'contacts':
      addBtn = lang.addContact;
      modalType = "ContactsDataModal";
      break;
    case 'devices':
      addBtn = lang.addDevice;
      modalType = "DevicesDataModal";
      break;
    case 'tasks':
      addBtn = lang.addTask;
      modalType = "TasksDataModal";
      break;
    case 'support':
      addBtn = lang.addTicket;
      modalType = "SupportDataModal";
      break;
  }


  const selectList = list => {
    dispatch(setFilters({
      filters: {
        [section]: {
          list: list
        }
      }
    }))
  }

  /* reorder list when order/filter changes */
  useEffect(() => {
    if (data) {
      if (section === "contacts" || section === "devices") {
        /* filter */
        const filteredList = data?.filter(item => {
          return (listSelected === "all" || item.category === listSelected)
        })

        /* sort */
        let orderedList = []
        if (sortList) {
          orderedList = [...filteredList].sort((a, b) => b.name.localeCompare(a.name))
        } else {
          orderedList = [...filteredList].sort((a, b) => a.name.localeCompare(b.name))
        }

        setDataList(orderedList)
      } else {
        /* filter */
        const filteredList = data?.filter(item => {
          return (listSelected === "all" || item.status === listSelected)
        })

        /* sort */
        let orderedList = []
        if (sortList) {
          orderedList = [...filteredList].sort((a, b) => a.localTime - b.localTime);
        } else {
          orderedList = [...filteredList].sort((a, b) => b.localTime - a.localTime);
        }

        setDataList(orderedList)
      }

    }
  }, [listSelected, sortList, data])


  return (
    <>
      <div className="btnWrapper">
        <button disabled={isLoadingData} onClick={() => {
          dispatch(setModal({ active: true, data: { modalType: modalType, new: true, user: user } }))
        }}>+ {addBtn}</button>

        <button disabled={isLoadingData} className={`listPicker ${listPickerOpen && "selected"}`} onClick={() => setListPickerOpen(listPickerOpen => !listPickerOpen)}>{lang.filter}</button>

        {
          listPickerOpen &&
          <Dropdown dropdownOpen={listPickerOpen} setDropdownOpen={setListPickerOpen} direction="row" anchor="right">
            {
              section === "contacts" || section === "devices" ?
                <>
                  <button disabled={isLoadingData} className={`dropdownBtn ${listSelected === "personal" && "selected"}`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    {lang.personal}
                  </button>
                  <button disabled={isLoadingData} className={`dropdownBtn ${listSelected === "company" && "selected"}`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    {lang.company}
                  </button>
                  <button disabled={isLoadingData} className={`dropdownBtn ${listSelected === "all" && "selected"}`}
                    onClick={() => {
                      selectList("all")
                    }}>
                    {lang.all}
                  </button>
                </> :
                <>
                  <button disabled={isLoadingData} className={`dropdownBtn ${listSelected === "completed" && "selected"}`}
                    onClick={() => {
                      selectList("completed")
                    }}>
                    {lang.completed}
                  </button>
                  <button disabled={isLoadingData} className={`dropdownBtn ${listSelected === "pending" && "selected"}`}
                    onClick={() => {
                      selectList("pending")
                    }}>
                    {lang.pending}
                  </button>
                  <button disabled={isLoadingData} className={`dropdownBtn ${listSelected === "all" && "selected"}`}
                    onClick={() => {
                      selectList("all")
                    }}>
                    {lang.all}
                  </button>
                </>
            }
          </Dropdown>
        }
      </div>
      <div className="sortBtn">
        <button disabled={isLoadingData} onClick={() => setSortList(sortList => !sortList)}>
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
    </>
  )
}

export default SectionBtnWrapper