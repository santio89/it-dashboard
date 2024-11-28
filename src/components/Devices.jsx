import { useDispatch } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useGetDevicesQuery } from '../store/slices/apiSlice';
import DataChart from "./DataChart";
import { useState, useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";

export default function Devices({ user }) {
  const dispatch = useDispatch()
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")
  const listContainer = useRef()

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

  useEffect(() => {
    !isLoadingDevices && listContainer.current && autoAnimate(listContainer.current)
  }, [listContainer, isLoadingDevices])

  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button onClick={() => {
            dispatch(setModal({ active: true, data: { modalType: "DevicesDataModal", newDevice: true, userId: user?.uid } }))
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
          isLoadingDevices ? <div className="loader">Loading...</div> :
            <ul className="items-list" ref={listContainer}>
              {
                dataDevices?.map(device => {
                  if (listSelected === "all" || device.category === listSelected) {
                    return (<li key={device.id}><button title={device.name} onClick={() => {
                      dispatch(setModal({ active: true, data: { modalType: "DevicesDataModal", deviceData: true, userId: user?.uid, ...device } })); setListPickerOpen(false)
                    }}>{device.name}</button></li>)
                  } else {
                    return null
                  }
                }
                )
              }
            </ul>
        }
      </div>
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button>Devices by category</button>
        </div>
        <div className="chartWrapper">
          <DataChart type={{ property: "category", items: "devices" }} data={dataDevices} isLoading={isLoadingDevices} />
        </div>
      </div>
    </>
  )
}
