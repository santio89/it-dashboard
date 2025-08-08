import { useGetContactsQuery, useGetContactsNextQuery, useGetDevicesQuery, useGetDevicesNextQuery, useGetTdlQuery, useGetTdlNextQuery, useGetSupportQuery, useGetSupportNextQuery } from '../store/slices/apiSlice';
import { useEffect, useState, useRef } from "react";
import SectionBtnWrapper from "./SectionBtnWrapper";
import SectionDataList from "./SectionDataList";
import SectionChartBtnWrapper from "./SectionChartBtnWrapper";
import SectionChartList from "./SectionChartList";


export default function MainSection({ user, section }) {
  const [dataList, setDataList] = useState(null)
  const [firstLoad, setFirstLoad] = useState(null)
  const [lastVisible, setLastVisible] = useState(null)

  const queries = {
    contacts: useGetContactsQuery,
    devices: useGetDevicesQuery,
    tasks: useGetTdlQuery,
    support: useGetSupportQuery
  }

  const queriesNext = {
    contacts: useGetContactsNextQuery,
    devices: useGetDevicesNextQuery,
    tasks: useGetTdlNextQuery,
    support: useGetSupportNextQuery
  }

  const {
    data: { [section === "support" ? "tickets" : section]: data, lastVisible: dataLastVisible } = {},
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    isSuccess: isSuccessData,
    isError: isErrorData,
    error: errorData,
  } = queries[section](user?.uid);

  queriesNext[section]({ userId: user?.uid, lastVisible });

  const handleRefetch = () => {
    setLastVisible(dataLastVisible)
  }

  useEffect(() => {
    let timeout;

    if (!isLoadingData) {
      timeout = setTimeout(() => {
        setFirstLoad(false)
      }, 0)
    } else {
      setFirstLoad(true)
    }

    return () => clearTimeout(timeout)
  }, [isLoadingData])


  return (
    <>
      <div className="site-section__inner site-section__list">
        <SectionBtnWrapper section={section} user={user} data={data} isLoadingData={isLoadingData} setDataList={setDataList} />

        <SectionDataList section={section} user={user} data={data} dataList={dataList} isLoadingData={isLoadingData} handleRefetch={handleRefetch} dataLastVisible={dataLastVisible} firstLoad={firstLoad} />
      </div>
      <div className="site-section__inner site-section__chart">
        <SectionChartBtnWrapper section={section} isLoadingData={isLoadingData} />

        <SectionChartList section={section} data={data} dataList={dataList} isLoadingData={isLoadingData} firstLoad={firstLoad} />
      </div>
    </>
  )
}
