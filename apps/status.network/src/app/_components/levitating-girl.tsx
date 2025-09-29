'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const LevitatingGirl = () => {
  return (
    <motion.div
      className="absolute -bottom-10 right-0 top-auto z-30 w-[240px] lg:bottom-auto lg:right-8 lg:top-1/4 lg:w-[180px] xl:top-32 xl:w-[342px]"
      initial={{ y: 1000 }}
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        y: {
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
      }}
    >
      <Image
        src="/girl-sit.png"
        alt="Levitating girl"
        priority
        width={342}
        height={470}
      />
    </motion.div>
  )
}

export { LevitatingGirl }
