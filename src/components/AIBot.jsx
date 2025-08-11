import { useState, useEffect } from "react";
import { firebaseAI } from "../config/firebase"
import { useSelector } from "react-redux";
import MainSection from "./MainSection";


export default function AIBot({ user }) {
  const [lastVisible, setLastVisible] = useState(null)
  const langSelected = useSelector(state => state.theme.lang);

  const askBot = async () => {

    const prompt = langSelected === "esp" ? "Escribe una historia corta aleatoria (en español)." : "Write a random short story (in english)."

    const result = await firebaseAI.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
  }

  /* const handleRefetch = () => {
    setLastVisible(dataLastVisible)
  } */


  useEffect(() => {
    askBot()
  }, [])


  return (
    <MainSection section="ai" user={user} /* data={data} isLoadingData={isLoadingData} isFetchingData={isFetchingData} dataLastVisible={dataLastVisible} handleRefetch={handleRefetch} */ />
  )
}
