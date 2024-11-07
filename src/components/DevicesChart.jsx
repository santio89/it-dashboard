import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';


export default function DevicesChart({ data, isLoading }) {
  const [devicesArray, setDevicesArray] = useState()

  /*   useEffect(() => {
      if (data) {
        const devices = [["Type", "Devices"]]
  
        const typeDeviceCount = data && data?.reduce((result, device) => {
          if (!device.type) return result
          if (!result.some(item => item.type.toUpperCase().trim() === device.type.toUpperCase().trim())) {
            result.push({ type: device.type.toUpperCase().trim(), devices: 1 });
          } else {
            const typeIndex = result.findIndex(item => item.type.toUpperCase().trim() === device.type.toUpperCase().trim());
            result[typeIndex].devices++;
          }
          return result;
        }, []);
  
        typeDeviceCount.forEach(type => {
          devices.push([type.type, type.devices])
        })
  
        setDevicesArray(devices)
      }
    }, [data]) */

  useEffect(() => {
    if (data) {
      const devices = [["Category", "Devices"]]

      const categoryDeviceCount = data && data?.reduce((result, device) => {
        if (!device.category) return result
        if (!result.some(item => item.category.toUpperCase().trim() === device.category.toUpperCase().trim())) {
          result.push({ category: device.category.toUpperCase().trim(), devices: 1 });
        } else {
          const categoryIndex = result.findIndex(item => item.category.toUpperCase().trim() === device.category.toUpperCase().trim());
          result[categoryIndex].devices++;
        }
        return result;
      }, []);

      categoryDeviceCount.forEach(category => {
        devices.push([category.category, category.devices])
      })

      setDevicesArray(devices)
    }
  }, [data])

  return (
    <>
      {
        isLoading ? "Loading..." :
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
            data={devicesArray}
            width="100%"
            height="320px"
          />
      }
    </>
  )
}
