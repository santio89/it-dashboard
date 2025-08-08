import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import DataChart from "./DataChart"
import { useTranslation } from "../hooks/useTranslation"
import autoAnimate from "@formkit/auto-animate"

function SectionChartList({ section, data, dataList, isLoadingData, firstLoad }) {
  const lang = useTranslation()
  const chartContainer = useRef()
  const graphicSelected = useSelector(state => state.theme.filters[section].charts)

  useEffect(() => {
    !isLoadingData && dataList && chartContainer.current && autoAnimate(chartContainer.current)
  }, [chartContainer, dataList, isLoadingData])


  return (
    isLoadingData ? <div className="loader">{lang.loading}...</div> :
      <div className="chartWrapper">
        <ul className="charts-list" ref={chartContainer}>
          {
            graphicSelected?.length === 0 ?
              <li>{lang.noChartsSelected}</li> :
              graphicSelected?.map((graphic) => {
                return <DataChart key={graphic} type={{ property: graphic, items: section }} data={data} firstLoad={firstLoad} />
              })
          }
        </ul>
      </div>
  )
}

export default SectionChartList