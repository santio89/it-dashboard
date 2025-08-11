import { useGetContactsQuery, useGetContactsNextQuery, useGetDevicesQuery, useGetDevicesNextQuery, useGetTdlQuery, useGetTdlNextQuery, useGetSupportQuery, useGetSupportNextQuery } from '../store/slices/apiSlice';
import { useEffect, useState, useRef } from "react";
import SectionBtnWrapper from "./SectionBtnWrapper";
import SectionDataList from "./SectionDataList";
import SectionChartBtnWrapper from "./SectionChartBtnWrapper";
import SectionChartList from "./SectionChartList";


export default function MainSection({ section, user, data, isLoadingData, isFetchingData, dataLastVisible, handleRefetch }) {
  const [dataList, setDataList] = useState(null)
  const [firstLoad, setFirstLoad] = useState(null)

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
        {
          (data || isLoadingData || isFetchingData) &&
          <>
            <SectionBtnWrapper section={section} user={user} data={data} isLoadingData={isLoadingData} isFetchingData={isFetchingData} setDataList={setDataList} />

            <SectionDataList section={section} user={user} data={data} dataList={dataList} isLoadingData={isLoadingData} isFetchingData={isFetchingData} handleRefetch={handleRefetch} dataLastVisible={dataLastVisible} firstLoad={firstLoad} />
          </>
        }

      </div>
      <div className="site-section__inner site-section__chart">
        {
          (data || isLoadingData || isFetchingData) &&
          <>
            <SectionChartBtnWrapper section={section} isLoadingData={isLoadingData} />

            <SectionChartList section={section} data={data} dataList={dataList} isLoadingData={isLoadingData} isFetchingData={isFetchingData} firstLoad={firstLoad} />
          </>
        }
      </div>
    </>
  )
}
