import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { useTranslation } from '../hooks/useTranslation';


export default function DataChart({ data, type, firstLoad }) {
  const lang = useTranslation()

  const [chartArray, setChartArray] = useState()

  useEffect(() => {
    if (data) {
      /* filter items by property [property, items]. EJ: ["category", "contacts"] */
      const values = [[type.property, type.items]]

      const propertyItemsCount = data && data?.reduce((result, dataItem) => {
        if (!dataItem[type.property]) return result

        if (!result.some(item => item[type.property].trim() === dataItem[type.property].trim())) {
          result.push({ [type.property]: dataItem[type.property].trim(), ammount: 1 });
        } else {
          const propertyIndex = result.findIndex(item => item[type.property].trim() === dataItem[type.property].trim());
          result[propertyIndex].ammount++;
        }
        return result;
      }, []);

      /* translate for preset properties */
      propertyItemsCount.forEach(property => {
        values.push([(type.property === "category" || type.property === "priority" || type.property === "status") ? lang[property[type.property]] : property[type.property], property.ammount])
      })

      setChartArray((values))
    }
  }, [data, lang])


  return (
    <>
      <li className={`dataChart ${firstLoad && "firstLoad"}`}>
        <Chart
          chartType={"PieChart"}
          options={{
            title: lang[type?.property],
            backgroundColor: {
              'fill': 'transparent',
            },
            fontSize: 16,
            pieSliceTextStyle: {
              color: `rgb(100,100,100)`,
            },
            titleTextStyle: {
              color: "#ffffff",
              bold: true,
              fontSize: 16,
            },
            legend: {
              position: "bottom",
              alignment: "center",
              textStyle: {
                color: "#ffffff",
                fontSize: 16,
                bold: false
              },
              maxLines: 1,
              pagingTextStyle: {
                color: `rgb(100,100,100)`
              },
              scrollArrows: {
                activeColor: `rgb(100,100,100)`,
                inactiveColor: `rgb(100,100,100)`
              },
            },
            pieSliceBorderColor: `rgb(100,100,100)`,
            pieSliceText: 'none',
            chartArea: { width: "65%", height: "65%" },
            colors: ['#3e424b', '#7f8187', '#d4d5d7', '#191b21', '#08090b'],
          }}
          data={chartArray}
          width={window.innerWidth < 513 ? "240px" : "100%"}
          height={window.innerWidth < 513 ? "240px" : "100%"}
        />
      </li>
    </>
  )
}
