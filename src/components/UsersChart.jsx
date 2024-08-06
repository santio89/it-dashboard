import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { useSelector } from 'react-redux';


export default function UsersChart({ data, isLoading }) {
  const [usersArray, setUsersArray] = useState()
  const lightTheme = useSelector(state => state.theme.light)

  useEffect(() => {
    if (data) {
      const users = [["Area", "Users"]]

      const areaUserCount = data && data?.reduce((result, user) => {
        if (!result.some(item => item.area === user.area)) {
          result.push({ area: user.area.toUpperCase().trim(), users: 1 });
        } else {
          const areaIndex = result.findIndex(item => item.area === user.area);
          result[areaIndex].users++;
        }
        return result;
      }, []);

      areaUserCount.forEach(area => {
        users.push([area.area, area.users])
      })

      setUsersArray(users)
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
              },
              pieSliceBorderColor: "transparent"
            }}
            data={usersArray}
            width="100%"
            height="100%"
          />
      }
    </>
  )
}
