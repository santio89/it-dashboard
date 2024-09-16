import { useDispatch } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useGetDevicesCompanyQuery, useGetDevicesQuery } from '../store/slices/apiSlice';
import DevicesChart from "./DevicesChart";
import { useState, useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";

export default function Devices({ user }) {
  const parentAnimateDevices = useRef()

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
    isSuccess: isSucessDevices,
    isError: isErrorDevices,
    error: errorDevices,
  } = useGetDevicesQuery(user?.uid);

  const selectList = list => {
    setListSelected(list)
    setListPickerOpen(false)
  }

  useEffect(() => {
    !isLoadingDevices && parentAnimateDevices.current && autoAnimate(parentAnimateDevices.current)
  }, [parentAnimateDevices, isLoadingDevices])

  return (
    <div className='site-section'>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button onClick={() => {
            dispatch(setModal({ active: true, data: { newDevice: true, userId: user?.uid, listSelected } }))
            setListPickerOpen(false)
          }}>+ Add device</button>
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
        {
          isLoadingDevices ? "Loading..." :
            <ul ref={parentAnimateDevices}>
              {
                dataDevices?.map(device => {
                  if (listSelected === "all" || device.category === listSelected) {
                    return (<li key={device.id}><button title={device.name} onClick={() => { dispatch(setModal({ active: true, data: { deviceData: true, userId: user?.uid, ...device } })); setListPickerOpen(false) }}>{device.name}</button></li>)
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
          <DevicesChart data={dataDevices} isLoading={isLoadingDevices} />
        </div>
      </div>
    </div>
  )
}
