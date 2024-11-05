import TDLChart from "./TDLChart"

export default function Support({ user }) {
  return (
    <div className='site-section'>
      <div className="site-section__inner site-section__list">
        SUPPORT PANEL
      </div>
      <div className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button>Tasks by category</button>
        </div>
        <div className="chartWrapper">
          <TDLChart  />
        </div>
      </div>
    </div>
  )
}
