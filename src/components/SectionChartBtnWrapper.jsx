import { useState } from "react";
import Dropdown from "./Dropdown"
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "../hooks/useTranslation";
import { setFilters } from "../store/slices/themeSlice";

function SectionChartBtnWrapper({ section, isLoadingData }) {
  let formFields = []
  switch (section) {
    case "contacts":
      formFields = ["category", "name", "email", "role", "tel", "comments"]
      break;
    case "devices":
      formFields = ["category", "name", "type", "model", "sn", "comments"]
      break;
    case "tasks":
      formFields = ["author", "title", "description", "priority", "status"]
      break;
    case "support":
      formFields = ["author", "title", "description", "priority", "status"]
      break;
    case "admin":
      formFields = ["contacts", "tickets"]
      break;
    default:
      console.log("Section not found")
      break;
  }

  const lang = useTranslation()
  const dispatch = useDispatch()
  const graphicSelected = useSelector(state => state.theme.filters[section].charts)
  const [graphicPickerOpen, setGraphicPickerOpen] = useState(false)

  const selectGraphic = graphic => {
    if (graphic === "none") {
      dispatch(setFilters({
        filters: {
          [section]: {
            charts: []
          }
        }
      }))
      return
    }

    if (graphic === "all") {
      dispatch(setFilters({
        filters: {
          [section]: {
            charts: [...formFields]
          }
        }
      }))
      return
    }

    if (graphicSelected.includes(graphic)) {
      dispatch(setFilters({
        filters: {
          [section]: {
            charts: graphicSelected.filter(graph => graph != graphic)
          }
        }
      }))
      return
    }

    dispatch(setFilters({
      filters: {
        [section]: {
          charts: [...graphicSelected, graphic]
        }
      }
    }))
  }


  return (
    <>
      <div className="btnWrapper">
        <button className={`${graphicPickerOpen && "selected"}`} disabled={isLoadingData} onClick={() => { setGraphicPickerOpen(graphicPickerOpen => !graphicPickerOpen) }}>{lang.charts}</button>
        {
          graphicPickerOpen &&
          <Dropdown dropdownOpen={graphicPickerOpen} setDropdownOpen={setGraphicPickerOpen} direction="column" anchor="left">
            {formFields.map((field) => {
              return <button key={field} disabled={isLoadingData} className={`dropdownBtn ${graphicSelected.includes(field) && "selected"}`}
                onClick={() => {
                  selectGraphic(field)
                }}>
                {
                  lang[field]
                }
              </button>
            })}
            <button key={"graphPickerBtn-none"} disabled={isLoadingData} className={`dropdownBtn ${graphicSelected.length === 0 && "selected"}`}
              onClick={() => {
                selectGraphic("none")
              }}>
              {
                lang["none"]
              }
            </button>
            <button key={"graphPickerBtn-all"} disabled={isLoadingData} className={`dropdownBtn ${graphicSelected.length === formFields.length && "selected"}`}
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
    </>
  )
}

export default SectionChartBtnWrapper