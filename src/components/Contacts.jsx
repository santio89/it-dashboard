import { useDispatch } from "react-redux";
import { setModal } from "../store/slices/modalSlice";
import { useGetContactsCompanyQuery, useGetContactsQuery } from '../store/slices/apiSlice';
import { useEffect, useState } from "react";
import DataChart from "./DataChart";
import { AnimatePresence, motion } from "motion/react";

export default function Contacts({ user }) {
  const dispatch = useDispatch()
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [listSelected, setListSelected] = useState("all")

  /*  const {
     data: dataContactsCompany,
     isLoading: isLoadingContactsCompany,
     isSuccess: isSuccessContactsCompany,
     isError: isErrorContactsCompany,
     error: errorContactsCompany,
   } = useGetContactsCompanyQuery(); */

  const {
    data: dataContacts,
    isLoading: isLoadingContacts,
    isFetching: isFetchingContacts,
    isSuccess: isSuccessContacts,
    isError: isErrorContacts,
    error: errorContacts,
  } = useGetContactsQuery(user?.uid);

  const selectList = list => {
    setListSelected(list)
    setListPickerOpen(false)
  }

  /*   useEffect(() => {
      !isLoadingContacts && listContainer.current && autoAnimate(listContainer.current)
    }, [listContainer, isLoadingContacts]) */


  return (
    <>
      <motion.div layout transition={{ duration: .2 }} className="site-section__inner site-section__list">
        <div className="btnWrapper">
          <motion.button onClick={() => {
            dispatch(setModal({ active: true, data: { newUser: true, userId: user?.uid, listSelected } }));
            setListPickerOpen(false)
          }}>+ Add contact</motion.button>
          <div className="listPickerWrapper">
            <div className="listPickerWrapper__btnContainer">
              {
                <button className={`listPicker ${listPickerOpen && "selected"}`} onClick={() => listPickerOpen ? selectList(listSelected) : setListPickerOpen(true)}>Filter</button>
              }
              {
                listPickerOpen &&
                <div className="listPickerOptions">
                  <button className={`listPicker ${listSelected !== "personal" && "notSelected"}`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button className={`listPicker ${listSelected !== "company" && "notSelected"}`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                  <button className={`listPicker ${listSelected !== "all" && "notSelected"}`}
                    onClick={() => {
                      selectList("all")
                    }}>
                    All
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
        {
          isLoadingContacts ? <div className="loader">Loading...</div> :
            <ul className="items-list" >
              <AnimatePresence>
                {
                  dataContacts?.map(contact => {
                    if (listSelected === "all" || contact.category === listSelected) {
                      return (<motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={contact.id}><button title={contact.name} onClick={() => { dispatch(setModal({ active: true, data: { userData: true, userId: user?.uid, ...contact } })); setListPickerOpen(false) }}>{contact.name}</button></motion.li>)
                    } else {
                      return null
                    }
                  }
                  )
                }
              </AnimatePresence>
            </ul>
        }
      </motion.div>
      <motion.div layout transition={{ duration: .2 }} className="site-section__inner site-section__chart">
        <div className="btnWrapper">
          <button>Contacts by category</button>
        </div>
        <div className="chartWrapper">
          <DataChart type={{ property: "category", items: "contacts" }} data={dataContacts} isLoading={isLoadingContacts} />
        </div>
      </motion.div>
    </>
  )
}
