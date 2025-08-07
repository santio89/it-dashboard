import { useState, useEffect } from "react";
import { firebaseAI } from "../config/firebase"
import { useSelector } from "react-redux";


export default function AIBot({ user }) {
  const langSelected = useSelector(state => state.theme.lang);

  const askBot = async () => {

    const prompt = langSelected === "esp" ? "Escribe una historia corta aleatoria (en español)." : "Write a random short story (in english)."

    const result = await firebaseAI.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
  }


  useEffect(() => {
    askBot()
  }, [])


  return (
    <>
      <div className="site-section__inner site-section__list">

      </div >
      <div className="site-section__inner site-section__chart">

      </div>
    </>
  )
}
