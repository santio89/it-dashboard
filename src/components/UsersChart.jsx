import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';


export default function UsersChart({ data, isLoading }) {
  const [usersArray, setUsersArray] = useState()

  useEffect(() => {
    if (data) {
      const users = [["Area", "Users"]]

      const areaUserCount = data && data?.reduce((result, user) => {
        if (!user.area) return result
        if (!result.some(item => item.area.toUpperCase().trim() === user.area.toUpperCase().trim())) {
          result.push({ area: user.area.toUpperCase().trim(), users: 1 });
        } else {
          const areaIndex = result.findIndex(item => item.area.toUpperCase().trim() === user.area.toUpperCase().trim());
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
            data={usersArray}
            width="100%"
            height="100%"
          />
      }
    </>
  )
}
