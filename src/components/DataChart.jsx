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
      {
        isLoading ? <div className="loader">Loading...</div> :
          <Chart
            chartType={"PieChart"}
            options={{
              title: "",
              backgroundColor: {
                'fill': 'transparent',
              },
              fontSize: 16,
              pieSliceTextStyle: {
                color: `rgb(240,240,240)`,
              },
              titleTextStyle: {
                color: `rgb(240,240,240)`,
                bold: true,
                fontSize: 16
              },
              legend: {
                /* position: "top", */
                alignment: "start",
                textStyle: {
                  color: `rgb(240,240,240)`,
                  fontSize: 16,
                  /* bold: true, */
                },
                maxLines: 1,
                pagingTextStyle: {
                  color: `rgb(240,240,240)`
                },
                scrollArrows: {
                  activeColor: `rgb(240,240,240)`,
                  inactiveColor: `rgb(100,100,100)`
                }
              },
              pieSliceBorderColor: `rgb(240,240,240)`,
              pieSliceText: 'none',
              chartArea: { width: "90%", height: "90%" },
              colors: ['#4394E5', '#87BB62', '#876FD4', '#F5921B', '#C7C7C7'],
            }}
            data={chartArray}
            width="100%"
            height="320px"
          />
      }
    </>
  )
}
