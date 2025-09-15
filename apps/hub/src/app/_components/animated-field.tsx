'use client'

import { useRef } from 'react'

import { motion, useScroll, useTransform } from 'framer-motion'

import { AnimatedElement } from './animated-element'

const AnimatedField = () => {
  const ref = useRef(null)
  const { scrollY } = useScroll()

  const y = useTransform(scrollY, [0, 900], [-30, -150])

  const coins = [
    {
      y: -20,
      delay: 0,
      speed: 1.1,
      src: '/hero/waifu.png',
      className:
        'right-0 mt-[280px] xl:mt-0 max-w-[320px] lg:max-w-[320px] xl:max-w-[500px] aspect-[500/754]',
    },
    {
      y: 420,
      delay: 0.4,
      speed: 0.3,
      src: '/hero/key.png',
      className: 'left-[265px] max-w-[130px] lg:max-w-[164px]',
    },
    {
      y: 480,
      delay: 0.2,
      speed: 1.2,
      src: '/coins/coin-1.png',
      className: 'left-[160px] max-w-[20px] lg:max-w-[45px]',
    },
    {
      y: 520,
      delay: 0.4,
      speed: 1.4,
      src: '/coins/coin-2.png',
      className: 'left-[190px] max-w-[35px] lg:max-w-[48px]',
    },
    {
      y: 575,
      delay: 0.6,
      speed: 1,
      src: '/coins/coin-3.png',
      className: 'left-[175px] max-w-[50px] lg:max-w-[70px]',
    },
    {
      y: 526,
      delay: 0.3,
      speed: 1.3,
      src: '/coins/coin-4.png',
      className: 'left-[267px] lg:mt-0 max-w-[25px] lg:max-w-[60px]',
    },
    {
      y: 380,
      delay: 0.5,
      speed: 1.5,
      src: '/coins/coin-5.png',
      className: 'left-1/3 max-w-[40px] lg:max-w-[60px] ',
    },
    {
      y: 280,
      delay: 0.6,
      speed: 1.2,
      src: '/coins/coin-6.png',
      className: 'left-[430px] max-w-[45px] lg:max-w-[70px] hidden 2xl:block',
    },
    {
      y: 450,
      delay: 0.7,
      speed: 1.4,
      src: '/coins/coin-7.png',
      className: 'left-[460px] max-w-[25px] lg:max-w-[45px] hidden 2xl:block',
    },
    {
      y: 635,
      delay: 0.8,
      speed: 1.3,
      src: '/coins/coin-8.png',
      className: 'left-[460px] max-w-[40px] lg:max-w-[70px] hidden 2xl:block',
    },
    {
      y: 650,
      delay: 0.9,
      speed: 1.5,
      src: '/coins/coin-9.png',
      className: 'left-1/2 max-w-[60px] lg:max-w-[80px]',
    },
    {
      y: 340,
      delay: 0.2,
      speed: 1.2,
      src: '/coins/coin-10.png',
      className: 'left-[650px] max-w-[35px] lg:max-w-[75px] hidden lg:block',
    },
    {
      y: 410,
      delay: 0.4,
      speed: 1.4,
      src: '/coins/coin-11.png',
      className: ' right-[450px] max-w-[32px] lg:max-w-[35px]',
    },
    {
      y: 570,
      delay: 0.1,
      speed: 1.1,
      src: '/coins/coin-12.png',
      className: 'right-[300px] max-w-[25px] lg:max-w-[32px] hidden 2xl:block',
    },
    {
      y: 635,
      delay: 0.3,
      speed: 1.3,
      src: '/coins/coin-13.png',
      className: 'right-[240px] max-w-[35px] lg:max-w-[50px] hidden 2xl:block',
    },
    {
      y: 600,
      delay: 0.5,
      speed: 1.5,
      src: '/coins/coin-14.png',
      className: 'right-[176px] max-w-[40px] lg:max-w-[52px] hidden 2xl:block',
    },
  ]

  return (
    <motion.div ref={ref} initial="hidden" animate="visible" style={{ y }}>
      {coins.map((coin, i) => {
        return (
          <AnimatedElement
            key={i}
            y={coin.y}
            delay={coin.delay}
            parallaxSpeed={coin.speed}
            src={coin.src}
            className={coin.className}
          />
        )
      })}
    </motion.div>
  )
}

export { AnimatedField }
