import SectionChartBtnWrapper from "./SectionChartBtnWrapper"
import SectionChartList from "./SectionChartList"
import { useTranslation } from "../hooks/useTranslation"

export default function Admin({ user }) {
  const lang = useTranslation()
  const data = []
  const dataList = []

  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="site-section__admin__title">
          {lang.admin}
        </div>
      </div>
      <div className="site-section__inner site-section__chart">
        {
          (data || isLoadingData || isFetchingData) &&
          <>
            <SectionChartBtnWrapper section={"admin"} isLoadingData={false} />

            <SectionChartList section={"admin"} data={data} dataList={dataList} isLoadingData={false} isFetchingData={false} firstLoad={false} />
          </>
        }
      </div>
    </>
  )
}
