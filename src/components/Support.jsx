import { useState } from "react"
import TDLChart from "./TDLChart"

export default function Support({ user }) {
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")

  const selectList = list => {
    setListSelected(list)
    setListPickerOpen(false)
  }

  /* rtk-query: useGetTicketsQuery */


  return (
    <div className='site-section'>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button onClick={() => {
          }}>+ Add ticket</button>
          <div className="listPickerWrapper">
            <div className="listPickerWrapper__btnContainer">
              {
                <button className={`listPicker ${listPickerOpen && "selected"}`} onClick={() => listPickerOpen ? selectList(listSelected) : setListPickerOpen(true)}>{listSelected}</button>
              }
              {
                listPickerOpen &&
                <div className="listPickerOptions">
                  <button className={`listPicker notSelected`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button className={`listPicker notSelected`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                  <button className={`listPicker notSelected`}
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
          <TDLChart />
        </div>
      </div>
    </div>
  )
}
