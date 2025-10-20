'use client'

import { cx } from 'cva'
import { motion } from 'framer-motion'

type Props = {
  y: number
  delay: number
  parallaxSpeed?: number
  src: string
  className?: string
}

const AnimatedElement = (props: Props) => {
  const { y, delay, parallaxSpeed = 1, src, className } = props

  return (
    <motion.div
      className={cx('absolute w-full', className)}
      initial={{ y: 1000, scale: 0 }}
      animate={{
        y: [y, y - 20, y],
        scale: 1,
      }}
      transition={{
        y: {
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: delay,
        },
        scale: {
          duration: 0.5,
          delay: delay,
          ease: 'backOut',
        },
      }}
      style={{
        translateY: parallaxSpeed / 10,
        aspectRatio: 1,
        backgroundImage: `url(${src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

export { AnimatedElement }
