import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';


export default function DevicesChart({ data, isLoading }) {
  const [devicesArray, setDevicesArray] = useState()

  useEffect(() => {
    if (data) {
      const devices = [["Area", "Devices"]]

      const areaDeviceCount = data && data?.reduce((result, device) => {
        if (!device.area) return result
        if (!result.some(item => item.area.toUpperCase().trim() === device.area.toUpperCase().trim())) {
          result.push({ area: device.area.toUpperCase().trim(), devices: 1 });
        } else {
          const areaIndex = result.findIndex(item => item.area.toUpperCase().trim() === device.area.toUpperCase().trim());
          result[areaIndex].devices++;
        }
        return result;
      }, []);

      areaDeviceCount.forEach(area => {
        devices.push([area.area, area.devices])
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
                /* position: "top",
                alignment: "center", */
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
              chartArea: { width: "98%", height: "98%" },
            }}
            data={devicesArray}
            width="100%"
            height="100%"
          />
      }
    </>
  )
}
