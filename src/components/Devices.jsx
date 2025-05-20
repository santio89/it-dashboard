import { useDispatch, useSelector } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { setFilters } from "../store/slices/themeSlice";
import { useGetDevicesQuery, useGetDevicesNextQuery, useSetDevicesMutation } from '../store/slices/apiSlice';
import DataChart from "./DataChart";
import { useState, useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { useTranslation } from "../hooks/useTranslation";
import Dropdown from "./Dropdown";

const formFields = ["category", "name", "type", "model", "sn", "comments"]

export default function Devices({ user }) {
  const lang = useTranslation()

  const dispatch = useDispatch()

  const [listPickerOpen, setListPickerOpen] = useState(false)
  const listSelected = useSelector(state => state.theme.filters.devices.list)
  const [sortList, setSortList] = useState(false)

  const [graphicPickerOpen, setGraphicPickerOpen] = useState(false)
  const graphicSelected = useSelector(state => state.theme.filters.devices.charts)

  const listContainer = useRef()
  const chartContainer = useRef()

  const [setDevices, resultSetDevices] = useSetDevicesMutation()

  const [devicesList, setDevicesList] = useState(null)
  const [firstLoad, setFirstLoad] = useState(null)

  const [lastVisible, setLastVisible] = useState(null)

  const {
    data: { devices: dataDevices, lastVisible: dataLastVisible } = {},
    isLoading: isLoadingDevices,
    isFetching: isFetchingDevices,
    isSuccess: isSucessDevices,
    isError: isErrorDevices,
    error: errorDevices,
  } = useGetDevicesQuery(user?.uid);

  useGetDevicesNextQuery({ userId: user?.uid, lastVisible });

  const handleRefetch = () => {
    setLastVisible(dataLastVisible)
  }

  const selectList = list => {
    dispatch(setFilters({
      filters: {
        devices: {
          list: list
        }
      }
    }))
  }

  const selectGraphic = graphic => {
    if (graphic === "none") {
      dispatch(setFilters({
        filters: {
          devices: {
            charts: []
          }
        }
      }))
      return
    }

    if (graphic === "all") {
      dispatch(setFilters({
        filters: {
          devices: {
            charts: [...formFields]
          }
        }
      }))
      return
    }

    if (graphicSelected.includes(graphic)) {
      dispatch(setFilters({
        filters: {
          devices: {
            charts: graphicSelected.filter(graph => graph != graphic)
          }
        }
      }))
      return
    }

    dispatch(setFilters({
      filters: {
        devices: {
          charts: [...graphicSelected, graphic]
        }
      }
    }))
  }

  const setDevicesFn = async (data) => {
    await setDevices(data)
  }

  /* order*/
  useEffect(() => {
    if (dataDevices) {
      /* filter */
      const filteredList = dataDevices?.filter(item => {
        return (listSelected === "all" || item.category === listSelected)
      })

      /* sort */
      let orderedList = []
      if (sortList) {
        orderedList = [...filteredList].sort((a, b) => b.name.localeCompare(a.name))
      } else {
        orderedList = [...filteredList].sort((a, b) => a.name.localeCompare(b.name))
      }

      setDevicesList(orderedList)
    }
  }, [listSelected, sortList, dataDevices])

  /* realtime updates -> disabled (too much read quota) */
  /* useEffect(() => {
    let firstSnapshot = true;
    const collectionRef = collection(db, "authUsersData", user.uid, "devices")

    onSnapshot(collectionRef, (snapshot) => {
      if (firstSnapshot) {
        firstSnapshot = false;
        return
      }

      let handleArray = []
      snapshot.docs.forEach(doc => {
        handleArray.push(doc.data())
      })
      handleArray.userId = user.uid

      setDevicesFn(handleArray)
    })
  }, [user]) */

  useEffect(() => {
    !isLoadingDevices && devicesList && listContainer.current && autoAnimate(listContainer.current)
    !isLoadingDevices && devicesList && listContainer.current && autoAnimate(chartContainer.current)
  }, [listContainer, chartContainer, isLoadingDevices, devicesList])

  useEffect(() => {
    let timeout;

    if (!isLoadingDevices) {
      timeout = setTimeout(() => {
        setFirstLoad(false)
      }, 0)
    } else {
      setFirstLoad(true)
    }

    return () => clearTimeout(timeout)
  }, [isLoadingDevices])

  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <button disabled={isLoadingDevices} onClick={() => {
            dispatch(setModal({ active: true, data: { modalType: "DevicesDataModal", newDevice: true, userId: user?.uid, dataList: dataDevices } }))
          }}>+ {lang.addDevice}</button>
          <div className="listPickerWrapper">
            <div className="listPickerWrapper__btnContainer">
              {
                <button disabled={isLoadingDevices} className={`listPicker filter ${listPickerOpen && "selected"}`} onClick={() => setListPickerOpen(listPickerOpen => !listPickerOpen)}>{lang.filter}</button>
              }
              {
                listPickerOpen &&
                <Dropdown dropdownOpen={listPickerOpen} setDropdownOpen={setListPickerOpen} direction="row" anchor="right">
                  <button disabled={isLoadingDevices} className={`dropdownBtn ${listSelected === "personal" && "selected"}`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    {lang.personal}
                  </button>
                  <button disabled={isLoadingDevices} className={`dropdownBtn ${listSelected === "company" && "selected"}`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    {lang.company}
                  </button>
                  <button disabled={isLoadingDevices} className={`dropdownBtn ${listSelected === "all" && "selected"}`}
                    onClick={() => {
                      selectList("all")
                    }}>
                    {lang.all}
                  </button>
                </Dropdown>
              }
            </div>
          </div>
        </div>
        <div className="sortBtn">
          <button disabled={isLoadingDevices} onClick={() => setSortList(sortList => !sortList)}>
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
        {
          isLoadingDevices ? <div className="loader">{lang.loading}...</div> :
            <div className="listWrapper">
              <ul className="items-list" ref={listContainer}>
                {
                  devicesList?.length === 0 ? <li className="no-data">{lang.noData}</li> :
                    <>
                      {
                        devicesList?.map(device =>
                          <li className={firstLoad && "firstLoad"} key={device.localId}><button disabled={device.id === "temp-id"} title={device.name} onClick={() => {
                            dispatch(setModal({ active: true, data: { modalType: "DevicesDataModal", deviceData: true, userId: user?.uid, ...device, dataList: dataDevices } }));
                          }}>{device.name}</button></li>)
                      }
                    </>
                }
              </ul>
              <div className="listWrapper__loadMore">
                <div>{lang.showing}: {devicesList?.length} - {lang.total}: {dataDevices?.length}</div>
                {<button onClick={handleRefetch} disabled={!dataLastVisible}>{dataLastVisible ? `${lang.loadMore}...` : lang.allLoaded}</button>}
              </div>
            </div>
        }
      </div>
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button className={`${graphicPickerOpen && "selected"}`} disabled={isLoadingDevices} onClick={() => { setGraphicPickerOpen(graphicPickerOpen => !graphicPickerOpen) }}>{lang.charts}</button>
          {
            graphicPickerOpen &&
            <Dropdown dropdownOpen={graphicPickerOpen} setDropdownOpen={setGraphicPickerOpen} direction="column" anchor="left">
              {formFields.map((field) => {
                return <button key={field} disabled={isLoadingDevices} className={`dropdownBtn ${graphicSelected.includes(field) && "selected"}`}
                  onClick={() => {
                    selectGraphic(field)
                  }}>
                  {
                    lang[field]
                  }
                </button>
              })}
              <button key={"graphPickerBtn-none"} disabled={isLoadingDevices} className={`dropdownBtn ${graphicSelected.length === 0 && "selected"}`}
                onClick={() => {
                  selectGraphic("none")
                }}>
                {
                  lang["none"]
                }
              </button>
              <button key={"graphPickerBtn-all"} disabled={isLoadingDevices} className={`dropdownBtn ${graphicSelected.length === formFields.length && "selected"}`}
                onClick={() => {
                  selectGraphic("all")
                }}>
                {
                  lang["all"]
                }
              </button>

            </Dropdown>
          }
        </div>
        {
          isLoadingDevices ? <div className="loader">{lang.loading}...</div> :
            <div className="chartWrapper">
              <ul className="charts-list" ref={chartContainer}>
                {
                  graphicSelected?.length === 0 ?
                    <li>{lang.noChartsSelected}</li> :
                    graphicSelected?.map((graphic) => {
                      return <DataChart key={graphic} type={{ property: graphic, items: "devices" }} data={dataDevices} firstLoad={firstLoad} />
                    })
                }
              </ul>
            </div>
        }
      </div>
    </>
  )
}
