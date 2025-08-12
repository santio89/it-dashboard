import { useState, useEffect } from "react";
import { firebaseAI } from "../config/firebase"
import { useSelector } from "react-redux";
import MainSection from "./MainSection";


export default function AIBot({ user }) {
  const [lastVisible, setLastVisible] = useState(null)
  const langSelected = useSelector(state => state.theme.lang);

  /* const handleRefetch = () => {
    setLastVisible(dataLastVisible)
  } */

  const data = []


  return (
    <MainSection section="aibot" user={user} data={data} />
  )
}
