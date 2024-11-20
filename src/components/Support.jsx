import { useState } from "react"
import DataChart from "./DataChart"

export default function Support({ user }) {
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")

  const selectList = list => {
    setListSelected(list)
    setListPickerOpen(false)
  }

  /* rtk-query: useGetTicketsQuery */


  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button onClick={() => {
          }}>+ Add ticket</button>
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
      </div>
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button>Tickets by category</button>
        </div>
        <div className="chartWrapper">
          <DataChart />
        </div>
      </div>
    </>
  )
}
