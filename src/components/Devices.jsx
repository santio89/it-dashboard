import { useDispatch } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useGetDevicesCompanyQuery, useGetDevicesQuery } from '../store/slices/apiSlice';
import DataChart from "./DataChart";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Devices({ user }) {
  const dispatch = useDispatch()
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")

  /*   const {
      data: dataDevicesCompany,
      isLoading: isLoadingDevicesCompany,
      isSuccess: isSucessDevicesCompany,
      isError: isErrorDevicesCompany,
      error: errorDevicesCompany,
    } = useGetDevicesCompanyQuery(); */

  const {
    data: dataDevices,
    isLoading: isLoadingDevices,
    isFetching: isFetchingDevices,
    isSuccess: isSucessDevices,
    isError: isErrorDevices,
    error: errorDevices,
  } = useGetDevicesQuery(user?.uid);

  const selectList = list => {
    setListSelected(list)
    setListPickerOpen(false)
  }

  return (
    <>
      <motion.div layout transition={{ duration: 0 }} className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button onClick={() => {
            dispatch(setModal({ active: true, data: { newDevice: true, userId: user?.uid, listSelected } }))
            setListPickerOpen(false)
          }}>+ Add device</button>
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
        {
          isLoadingDevices ? <div className="loader">Loading...</div> :
            <ul className="items-list">
              <AnimatePresence>
                {
                  dataDevices?.map(device => {
                    if (listSelected === "all" || device.category === listSelected) {
                      return (<motion.li layout transition={{ duration: .2 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={device.id}><button title={device.name} onClick={() => { dispatch(setModal({ active: true, data: { deviceData: true, userId: user?.uid, ...device } })); setListPickerOpen(false) }}>{device.name}</button></motion.li>)
                    } else {
                      return null
                    }
                  }
                  )
                }
              </AnimatePresence>
            </ul>
        }
      </motion.div>
      <motion.div layout transition={{ duration: 0 }} className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button>Devices by category</button>
        </div>
        <div className="chartWrapper">
          <DataChart type={{ property: "category", items: "devices" }} data={dataDevices} isLoading={isLoadingDevices} />
        </div>
      </motion.div>
    </>
  )
}
