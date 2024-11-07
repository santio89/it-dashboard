import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';


export default function TDLChart({ data, isLoading }) {
  const [tdlArray, setTdlArray] = useState()

  /*   useEffect(() => {
      if (data) {
        const tdl = [["Priority", "Tasks"]]
  
        const priorityTaskCount = data && data?.reduce((result, task) => {
          if (!task.priority) return result
          if (!result.some(item => item.priority.toUpperCase().trim() === task.priority.toUpperCase().trim())) {
            result.push({ priority: task.priority.toUpperCase().trim(), tasks: 1 });
          } else {
            const priorityIndex = result.findIndex(item => item.priority.toUpperCase().trim() === task.priority.toUpperCase().trim());
            result[priorityIndex].tasks++;
          }
          return result;
        }, []);
  
        priorityTaskCount.forEach(priority => {
          tdl.push([priority.priority, priority.tasks])
        })
  
        setTdlArray(tdl)
      }
    }, [data]) */

  useEffect(() => {
    if (data) {
      const tdl = [["Category", "Tasks"]]

      const categoryTaskCount = data && data?.reduce((result, task) => {
        if (!task.category) return result
        if (!result.some(item => item.category.toUpperCase().trim() === task.category.toUpperCase().trim())) {
          result.push({ category: task.category.toUpperCase().trim(), tasks: 1 });
        } else {
          const categoryIndex = result.findIndex(item => item.category.toUpperCase().trim() === task.category.toUpperCase().trim());
          result[categoryIndex].tasks++;
        }
        return result;
      }, []);

      categoryTaskCount.forEach(category => {
        tdl.push([category.category, category.tasks])
      })

      setTdlArray(tdl)
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
              chartArea: { width: "90%", height: "90%" },
              colors: ['#4394E5', '#87BB62', '#876FD4', '#F5921B', '#C7C7C7'],
            }}
            data={tdlArray}
            width="100%"
            height="320px"
          />
      }
    </>
  )
}
