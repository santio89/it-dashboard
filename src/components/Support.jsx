import { useState } from "react"
import DataChart from "./DataChart"
import { motion } from "motion/react"

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
      <motion.div layout transition={{ duration: 0 }} className="site-section__inner site-section__list">
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
                  <button className={`listPicker ${listSelected !== "personal" && "notSelected"}`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button className={`listPicker ${listSelected !== "company" && "notSelected"}`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                  <button className={`listPicker ${listSelected !== "all" && "notSelected"}`}
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
      </motion.div>
      <motion.div layout transition={{ duration: 0 }} className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button>Tickets by category</button>
        </div>
        <div className="chartWrapper">
          <DataChart />
        </div>
      </motion.div>
    </>
  )
}
