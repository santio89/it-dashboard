import { motion } from "motion/react"

export default function Admin({ user }) {
  return (
    <>
      <motion.div layout transition={{ duration: .2 }} className="site-section__inner admin">
        ADMIN PANEL
      </motion.div>
    </>
  )
}
