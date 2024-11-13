import { useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom"
/* import { Gradient } from "../utils/gradient" */

export default function Home() {
  /*   const gradientRefA = useRef()
    const gradientRefB = useRef()
    const gradientRefC = useRef()
    const gradientRefD = useRef()
    const gradientA = useMemo(() => new Gradient(), [])
    const gradientB = useMemo(() => new Gradient(), [])
    const gradientC = useMemo(() => new Gradient(), [])
    const gradientD = useMemo(() => new Gradient(), [])
  
    useEffect(() => {
      if (gradientRefA.current) {
        gradientA.initGradient(".canvas-1");
      }
    }, [gradientA, gradientRefA]);
  
    useEffect(() => {
      if (gradientRefB.current) {
        gradientB.initGradient(".canvas-2");
      }
    }, [gradientB, gradientRefB]);
  
    useEffect(() => {
      if (gradientRefC.current) {
        gradientC.initGradient(".canvas-3");
      }
    }, [gradientC, gradientRefC]);
  
    useEffect(() => {
      if (gradientRefD.current) {
        gradientD.initGradient(".canvas-4");
      }
    }, [gradientD, gradientRefD]); */

  return (
    <>
      <div className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/contacts">
          <div className="bg-gradient"></div>
          <h2>Contacts</h2>
          <p>Manage contacts</p>
        </Link>
      </div>
      <div className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/devices">
          <div className="bg-gradient"></div>
          <h2>Devices</h2>
          <p>Manage devices</p>
        </Link>
      </div>
      <div className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/tdl">
          <div className="bg-gradient"></div>
          <h2>Tasks</h2>
          <p>Manage tasks</p>
        </Link>
      </div>
      <div className="site-section__inner site-section__homeCard" >
        <Link className="homeCard-anchor" to="/support">
          <div className="bg-gradient"></div>
          <h2>Support</h2>
          <p>Contact support</p>
        </Link>
      </div>
    </>
  )
}
