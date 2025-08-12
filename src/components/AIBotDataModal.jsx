import { useState, useRef } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { firebaseAI } from '../config/firebase'

export default function AIBotDataModal({ modalData }) {
  const lang = useTranslation()

  const aiBotQuestion = useRef();

  /* const modalActive = useSelector(state => state.modal.active) */

  const [newQuestion, setNewQuestion] = useState("")
  const [newReply, setNewReply] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addQuestionFn = async (e) => {
    e.preventDefault()
    const prompt = newQuestion

    setIsLoading(true)
    const result = await firebaseAI.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    setNewReply(responseText)
    setIsLoading(false)
  }

  const enterSubmit = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      trimInputs()
      aiBotQuestion.current.blur()
      addQuestionFn(e)
    }
  }

  const trimInputs = () => {
    setNewQuestion(newQuestion => newQuestion.trim())
  }

  /* useEffect(() => {
    if (!modalActive) {
      setNewQuestion("")
      setNewReply("")
    }
  }, [modalActive]) */


  return (
    <>
      {
        modalData?.new &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.aiBot}</h2>
            <div className="listPickerWrapper__btnContainer">
              <input disabled form="modalForm" required placeholder={lang.author} title={`${lang.author}: ${modalData?.author}`} className={`listPicker disabled selected`} type="text" value={modalData?.user?.email || lang.guest} autoCapitalize='off' autoComplete='off' spellCheck='false' />
            </div>
          </div>
          <form id="modalForm" autoCapitalize='off' autoComplete='off' spellCheck='false' disabled={isLoading} className='mainModal__data__form taskContainer' onKeyDown={(e) => { enterSubmit(e) }} onSubmit={(e) => addQuestionFn(e)}>
            <fieldset>
              <legend><label htmlFor="addDescription">{lang.question}</label></legend>
              <textarea ref={aiBotQuestion} id="addDescription" rows="2" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} maxLength={2000} className='taskOpenContent' />
            </fieldset>
            {
              newReply &&
              <fieldset>
                <legend><label htmlFor="addDescription">{lang.reply}</label></legend>
                <textarea id="addDescription" readOnly disabled rows="2" value={newReply} className='taskOpenContent reply ai' />
              </fieldset>

            }
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send' onClick={trimInputs}>{lang.send}</button>
            </div>
          </form>
        </>
      }
    </>
  )
}
