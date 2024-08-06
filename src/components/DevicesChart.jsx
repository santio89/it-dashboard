import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { useSelector } from 'react-redux';


export default function DevicesChart({ data, isLoading }) {
  const [devicesArray, setDevicesArray] = useState()
  const lightTheme = useSelector(state => state.theme.light)

  useEffect(() => {
    if (data) {
      const devices = [["Area", "Devices"]]

      const areaDeviceCount = data && data?.reduce((result, device) => {
        if (!device.area) return result
        if (!result.some(item => item.area === device.area)) {
          result.push({ area: device.area.toUpperCase().trim(), devices: 1 });
        } else {
          const areaIndex = result.findIndex(item => item.area === device.area);
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
              fontSize: 8,
              pieSliceTextStyle: {
                color: `${lightTheme ? "rgb(30,30,30)" : "rgb(240,240,240)"}`,
              },
              titleTextStyle: {
                color: `${lightTheme ? "rgb(30,30,30)" : "rgb(240,240,240)"}`,
                bold: true,
                fontSize: 8
              },
              legend: {
                position: "top",
                alignment: "center",
                textStyle: {
                  color: `${lightTheme ? "rgb(30,30,30)" : "rgb(240,240,240)"}`,
                  fontSize: 8,
                  bold: true,
                },
                maxLines: 2,
                pagingTextStyle: {
                  color: `${lightTheme ? "rgb(30,30,30)" : "rgb(240,240,240)"}`
                },
                scrollArrows: {
                  activeColor: `${lightTheme ? "rgb(30,30,30)" : "rgb(240,240,240)"}`,
                  inactiveColor: `rgb(100,100,100)`
                }
              },
              pieSliceBorderColor: "transparent"
            }}
            data={devicesArray}
            width="100%"
            height="100%"
          />
      }
    </>
  )
}
