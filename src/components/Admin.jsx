import MainSection from "./MainSection"
import SectionChartBtnWrapper from "./SectionChartBtnWrapper"
import SectionChartList from "./SectionChartList"

export default function Admin({ user }) {
  const data = {}
  const dataList = {}

  return (
    <>
      <div className="site-section__inner site-section__list">
        <div className="site-section__admin__title">
          ADMIN
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
