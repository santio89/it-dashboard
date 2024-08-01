import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';


export default function UserChart({ data }) {
  const [usersArray, setUsersArray] = useState()

  useEffect(() => {
    if (data) {
      const users = [["Area", "Users"]]

      const areaUserCount = data && data?.reduce((result, user) => {
        if (!result.some(item => item.area === user.area)) {
          result.push({ area: user.area, users: 1 });
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

  useEffect(() => {
    console.log(usersArray)
  }, [usersArray])

  return (
    <>
      <Chart

        chartType={"PieChart"}
        options={{
          title: "Users chart",
          backgroundColor: {
            'fill': 'rgb(150,150,150)',
            'fillOpacity': 0.5
          },
          fontSize: 12,
          titleTextStyle: {
            color: "rgb(250,250,250)",
            bold: true,
            fontSize: 16
          },
        }}
        data={usersArray}
        width="100%"
        height="100%"
      />
    </>
  )
}
