import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';


export default function ContactsChart({ data, isLoading }) {
  const [contactsArray, setContactsArray] = useState()

  /*   useEffect(() => {
      if (data) {
        const contacts = [["Role", "Contacts"]]
  
        const roleContactCount = data && data?.reduce((result, contact) => {
          if (!contact.role) return result
          if (!result.some(item => item.role.toUpperCase().trim() === contact.role.toUpperCase().trim())) {
            result.push({ role: contact.role.toUpperCase().trim(), users: 1 });
          } else {
            const roleIndex = result.findIndex(item => item.role.toUpperCase().trim() === contact.role.toUpperCase().trim());
            result[roleIndex].users++;
          }
          return result;
        }, []);
  
        roleContactCount.forEach(role => {
          contacts.push([role.role, role.users])
        })
  
        setContactsArray(contacts)
      }
    }, [data]) */

  useEffect(() => {
    if (data) {
      const contacts = [["Category", "Contacts"]]

      const categoryContactCount = data && data?.reduce((result, contact) => {
        if (!contact.category) return result
        if (!result.some(item => item.category.toUpperCase().trim() === contact.category.toUpperCase().trim())) {
          result.push({ category: contact.category.toUpperCase().trim(), users: 1 });
        } else {
          const categoryIndex = result.findIndex(item => item.category.toUpperCase().trim() === contact.category.toUpperCase().trim());
          result[categoryIndex].users++;
        }
        return result;
      }, []);

      categoryContactCount.forEach(category => {
        contacts.push([category.category, category.users])
      })

      setContactsArray(contacts)
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
            }}
            data={contactsArray}
            width="100%"
            height="320px"
          />
      }
    </>
  )
}
