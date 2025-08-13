import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { firebaseAI } from '../config/firebase'

export default function AIBotDataModal({ modalData }) {
  const lang = useTranslation()

  const aiBotQuestion = useRef();
  const lastQA = useRef()

  const [newQuestion, setNewQuestion] = useState("")
  const [chatHistory, setChatHistory] = useState([]);

  const [isLoading, setIsLoading] = useState(false)

  const addQuestionFn = async (e) => {
    e.preventDefault()

    const prompt = `${chatHistory.map(({ question, answer }) => `\nQ: ${question}\nA: ${answer}`).join('\n')}\nQ: ${newQuestion}\nA:`;

    setIsLoading(true)
    const result = await firebaseAI.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    const cleanedResponseText = responseText.replace(/Q:|A:|P:|R:/g, '').trim();

    setChatHistory([...chatHistory, { question: newQuestion, answer: cleanedResponseText }]);

    setNewQuestion("")
    setIsLoading(false)
    aiBotQuestion.current.focus()
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

  const clearHistory = () => {
    setChatHistory([])
    setNewQuestion("")
  }

  useEffect(() => {
    if (lastQA.current) {
      lastQA.current.scrollIntoView();
    }
  }, [chatHistory]);

  return (
    <>
      {
        modalData?.new &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.aiBot}</h2>
            <div>Gemini 2.5</div>
            <div className="listPickerWrapper__btnContainer">
              <input disabled form="modalForm" required placeholder={lang.author} title={`${lang.author}: ${modalData?.author}`} className={`listPicker disabled selected`} type="text" value={modalData?.user?.email || lang.guest} autoCapitalize='off' autoComplete='off' spellCheck='false' />
            </div>
          </div>
          <form id="modalForm" autoCapitalize='off' autoComplete='off' spellCheck='false' disabled={isLoading} className='mainModal__data__form taskContainer' onKeyDown={(e) => { enterSubmit(e) }} onSubmit={(e) => addQuestionFn(e)}>
            {
              chatHistory.map(({ question, answer }, index) => (
                <div key={`q/a-${index}`} ref={index === chatHistory.length - 1 ? lastQA : null}>
                  <fieldset>
                    <legend><label htmlFor={`question-${index}`}>{lang.question}</label></legend>
                    <textarea id={`question-${index}`} readOnly disabled rows="2" value={question} onChange={e => setNewQuestion(e.target.value)} maxLength={2000} className='taskOpenContent aiQuestion' />
                  </fieldset>
                  <fieldset>
                    <legend><label htmlFor={`answer-${index}`}>{lang.answer}</label></legend>
                    <textarea id={`answer-${index}`} readOnly disabled rows="2" value={answer} className='taskOpenContent reply aiAnswer' />
                  </fieldset>
                </div>
              ))
            }
            <div>
              <fieldset>
                <legend><label htmlFor="addQuestion">{lang.question}</label></legend>
                <textarea ref={aiBotQuestion} id="addQuestion" rows="2" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} maxLength={2000} className='taskOpenContent aiQuestion' />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send' onClick={trimInputs}>{lang.send}</button>
              <button className='mainModal__send' type='button' onClick={clearHistory}>{lang.clearHistory}</button>
            </div>
          </form>
        </>
      }
    </>
  )
}
