import { useRef, useState, useEffect } from 'react'

function Dropdown({ children, dropdownOpen, setDropdownOpen, direction, anchor }) {
  const dropdownRef = useRef()


  useEffect(() => {
    const handlePickerCloseClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    const handlePickerCloseEsc = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      setTimeout(() => {
        window.addEventListener("click", handlePickerCloseClick)
        window.addEventListener("keydown", handlePickerCloseEsc)
      }, [0])
    }

    return () => {
      window.removeEventListener("click", handlePickerCloseClick);
      window.removeEventListener("keydown", handlePickerCloseEsc)
    }

  }, [dropdownOpen])


  return (
    <div ref={dropdownRef} className="dropdownWrapper" data-direction={direction} data-anchor={anchor}>

      {children}

    </div>
  )
}

export default Dropdown