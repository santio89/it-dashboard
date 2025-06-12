import { useRef, useState, useEffect } from 'react'

function Cursor() {
  const cursor = useRef()
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  })
  const [isMouseClicked, setIsMouseClicked] = useState(false)

  useEffect(() => {
    cursor.current.style.left = mousePosition.x - 16 + "px";
    cursor.current.style.top = mousePosition.y - 16 + "px";
  }, [mousePosition])

  useEffect(() => {
    const mouseMove = e => { setMousePosition({ x: e.clientX, y: e.clientY }) }
    const mouseClickTrue = () => { setIsMouseClicked(true) }
    const mouseClickFalse = () => { setIsMouseClicked(false) }

    window.addEventListener("mousemove", mouseMove)
    window.addEventListener("mousedown", mouseClickTrue)
    window.addEventListener("mouseup", mouseClickFalse)

    return () => {
      window.removeEventListener("mousemove", mouseMove)
      window.removeEventListener("mousedown", mouseClickTrue)
      window.removeEventListener("mouseup", mouseClickFalse)
    }
  }, [])


  return (
    <div ref={cursor} className={`cursor ${isMouseClicked && "clicked"}`}></div>
  )
}

export default Cursor