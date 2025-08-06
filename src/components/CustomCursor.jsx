import { useRef, useState, useEffect } from 'react'

function CustomCursor() {
  const cursor = useRef()
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  })
  const [isMouseClicked, setIsMouseClicked] = useState(false)

  useEffect(() => {
    cursor.current.style.left = mousePosition.x - 8 + "px";
    cursor.current.style.top = mousePosition.y - 8 + "px";
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

export default CustomCursor


/* .cursor {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: var(--spotlight-color);
  transition: scale 200ms ease;
  scale: 2;
  pointer-events: none;
  backdrop-filter: blur(8px);

  &.clicked {
    scale: 1;
  }
} */