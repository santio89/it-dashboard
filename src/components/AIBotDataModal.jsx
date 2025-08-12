import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from '../hooks/useTranslation'
import { firebaseAI } from '../config/firebase'

export default function AIBotDataModal({ modalData }) {
  const lang = useTranslation()

  const aiBotQuestion = useRef();

  const modalActive = useSelector(state => state.modal.active)

  const [newQuestion, setNewQuestion] = useState("")
  const [newReply, setNewReply] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  /* const [addQuestion, resultAddQuestion] = useAddQuestionMutation() */

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

  const preventEnterSubmit = (e) => {
    /* submit on shift+enter */
    if (e.key === "Enter" && e.shiftKey) {
      trimInputs()
      aiBotQuestion.current.blur()
      addQuestionFn(e)
      return
    } else if (e.key === "Enter" && e.target.className !== "mainModal__send" && e.target.tagName !== "TEXTAREA" && e.target.ariaLabel !== "textarea") {
      e.preventDefault()
    }
  }

  const trimInputs = () => {
    setNewQuestion(newQuestion => newQuestion.trim())
  }

  useEffect(() => {
    if (!modalActive) {
      setNewQuestion("")
      setNewReply("")
      /* setEditMode(false)
      setDeleteMode(false) */
    }
  }, [modalActive])


  return (
    <>

      {/* {
        !editMode && !deleteMode && !modalData?.new &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.ticket}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <input disabled form="modalForm" required placeholder={lang.author} title={`${lang.author}: ${modalData?.author}`} className={`listPicker disabled selected`} type="text" value={modalData?.author} autoCapitalize='off' autoComplete='off' spellCheck='false' />
            </div>
          </div>
          <form id="modalForm" autoCapitalize='off' autoComplete='off' spellCheck='false' className='mainModal__data__form taskContainer disabled'>
            <fieldset>
              <legend><label htmlFor="title">{lang.title}</label></legend>
              <textarea id="deleteTitle" placeholder={lang.required} required readOnly disabled rows="1" className='taskOpenTitle' value={modalData?.title || "-"} />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="description">{lang.description}</label></legend>
              <textarea id="description" readOnly disabled rows="2" className='taskOpenContent' value={modalData?.description || "-"} />
            </fieldset>
            {modalData?.user.domainAdmin &&
              <div className='mainModal__btnContainer'>
                <button type='button' className='mainModal__send' onClick={() => editModeFN()}>{lang.edit}</button>
                <button type='button' className='mainModal__send' onClick={() => setDeleteMode(true)}>{lang.delete}</button>
              </div>
            }
          </form>
        </>
      } */}

      {/* {
        deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.deleteTicket}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <input disabled form="modalForm" required placeholder={lang.author} title={`${lang.author}: ${modalData?.author}`} className={`listPicker disabled selected deleteMode`} type="text" value={modalData?.author} autoCapitalize='off' autoComplete='off' spellCheck='false' />
            </div>
          </div>
          <form id="modalForm" autoCapitalize='off' autoComplete='off' spellCheck='false' className='mainModal__data__form taskContainer deleteMode disabled' onKeyDown={(e) => { preventEnterSubmit(e) }} disabled={isLoading} onSubmit={(e) => deleteSupportFn(e, modalData)}>
            <fieldset>
              <legend><label htmlFor="deleteTitle">{lang.title}</label></legend>
              <textarea id="deleteTitle" placeholder={lang.required} required readOnly disabled rows="1" className='taskOpenTitle' value={modalData?.title || "-"} />
            </fieldset>
            <fieldset>
              <legend><label htmlFor="deleteDescription">{lang.description}</label></legend>
              <textarea id="deleteDescription" readOnly disabled rows="2" className='taskOpenContent' value={modalData?.description || "-"} />
            </fieldset>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>{lang.cancel}</button>
              <button className='mainModal__send' onClick={trimInputs}>{lang.confirm}</button>
            </div>
          </form>
        </>
      } */}

      {
        modalData?.new &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.aiBot}</h2>
            <div className="listPickerWrapper__btnContainer">
              <input disabled form="modalForm" required placeholder={lang.author} title={`${lang.author}: ${modalData?.author}`} className={`listPicker disabled selected`} type="text" value={modalData?.user?.email || lang.guest} autoCapitalize='off' autoComplete='off' spellCheck='false' />
            </div>
          </div>
          <form id="modalForm" autoCapitalize='off' autoComplete='off' spellCheck='false' disabled={isLoading} className='mainModal__data__form taskContainer' onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => addQuestionFn(e)}>
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
