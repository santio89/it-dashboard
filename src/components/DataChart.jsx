import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';


export default function DataChart({ data, type, isLoading }) {
  const [chartArray, setChartArray] = useState()

  useEffect(() => {
    if (data) {
      /* filter items by property [property, items]. EJ: ["category", "contacts"] */
      const values = [[type.property, type.items]]

      const propertyItemsCount = data && data?.reduce((result, dataItem) => {
        if (!dataItem[type.property]) return result

        if (!result.some(item => item[type.property].toUpperCase().trim() === dataItem[type.property].toUpperCase().trim())) {
          result.push({ [type.property]: dataItem[type.property].toUpperCase().trim(), ammount: 1 });
        } else {
          const propertyIndex = result.findIndex(item => item[type.property].toUpperCase().trim() === dataItem[type.property].toUpperCase().trim());
          result[propertyIndex].ammount++;
        }
        return result;
      }, []);

      propertyItemsCount.forEach(property => {
        values.push([property[type.property], property.ammount])
      })

      setChartArray(values)
    }
  }, [data])


  return (
    <>
      <div className="dataChart">
        <Chart
          chartType={"PieChart"}
          options={{
            title: type?.property,
            backgroundColor: {
              'fill': 'transparent',
            },
            fontSize: 16,
            pieSliceTextStyle: {
              color: `rgb(100,100,100)`,
            },
            titleTextStyle: {
              color: `rgb(100,100,100)`,
              bold: true,
              fontSize: 16
            },
            legend: {
              position: "right",
              alignment: "start",
              textStyle: {
                color: `rgb(100,100,100)`,
                fontSize: 16,
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
            pieSliceBorderColor: `rgb(250,250,250)`,
            pieSliceText: 'none',
            /* chartArea: { width: "70%", height: "70%" }, */
            colors: ['#4394E5', '#87BB62', '#876FD4', '#F5921B', '#C7C7C7'],
          }}
          data={chartArray}
          width={window.innerWidth < 513 ? "240px" : "100%"}
          height={window.innerWidth < 513 ? "240px" : "100%"}
        />
      </div>
    </>
  )
}
