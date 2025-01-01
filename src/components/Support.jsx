import { useRef, useState, useEffect } from "react"
import DataChart from "./DataChart"
import { useDispatch } from "react-redux"
import { setModal } from "../store/slices/modalSlice"
import { useGetSupportQuery } from "../store/slices/apiSlice"
import autoAnimate from "@formkit/auto-animate"

export default function Support({ user }) {
  const dispatch = useDispatch()
  const [sortList, setSortList] = useState(false)
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")

  const listContainer = useRef()

  const [supportList, setSupportList] = useState(null)

  const {
    data: dataSupport,
    isLoading: isLoadingSupport,
    isFetching: isFetchingSupport,
    isSuccess: isSuccessSupport,
    isError: isErrorSupport,
    error: errorSupport,
  } = useGetSupportQuery(user.uid);

  const selectList = list => {
    setListSelected(list)
    setListPickerOpen(false)
  }

  /* order */
  useEffect(() => {
    if (dataSupport) {
      /* filter */
      const filteredList = dataSupport?.filter(item => {
        return (listSelected === "all" || item.category === listSelected)
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
  }, [sortList, listSelected, dataSupport])

  useEffect(() => {
    !isLoadingSupport && supportList && listContainer.current && autoAnimate(listContainer.current)
  }, [listContainer, isLoadingSupport, supportList])


  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button disabled={isLoadingSupport} onClick={() => {
            dispatch(setModal({ active: true, data: { modalType: "SupportDataModal", newTicket: true, userId: user?.uid, dataList: dataSupport } }))
          }}>+ Add ticket</button>
          <div className="listPickerWrapper">
            <div className="listPickerWrapper__btnContainer">
              {
                <button disabled={isLoadingSupport} className={`listPicker filter ${listPickerOpen && "selected"}`} onClick={() => listPickerOpen ? selectList(listSelected) : setListPickerOpen(true)}>Filter</button>
              }
              {
                listPickerOpen &&
                <div className="listPickerOptions">
                  <button disabled={isLoadingSupport} className={`listPicker ${listSelected === "personal" && "selected"}`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button disabled={isLoadingSupport} className={`listPicker ${listSelected === "company" && "selected"}`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                  <button disabled={isLoadingSupport} className={`listPicker ${listSelected === "all" && "selected"}`}
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
          isLoadingSupport ? <div className="loader">Loading...</div> :
            <div className="listWrapper">
              <ul className="support-list" ref={listContainer}>
                {
                  supportList?.map((ticket) =>
                    <li key={ticket.localId}><button disabled={ticket.id === "temp-id"} className="taskContentBtn" title={ticket.title} onClick={() => { dispatch(setModal({ active: true, data: { modalType: "SupportDataModal", supportData: true, userId: user?.uid, ...ticket, dataList: dataSupport } })); setListPickerOpen(false) }}>{ticket.title}</button></li>
                  )
                }
                {
                  supportList?.length === 0 && <li className="no-data">No Data</li>
                }
              </ul>
            </div>
        }
      </div>
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button disabled={isLoadingSupport}>Tickets by category</button>
        </div>
        <div className="chartWrapper">
          <DataChart type={{ property: "category", items: "tickets" }} data={dataSupport} isLoading={isLoadingSupport} />
        </div>
      </div>
    </>
  )
}
