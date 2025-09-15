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
        'right-[-260px] max-w-[320px] lg:max-w-[450px] 2xl:max-w-[754px]',
    },
    {
      y: 380,
      delay: 0.4,
      speed: 0.3,
      src: '/hero/key.png',
      className: 'left-1/4 max-w-[130px] lg:max-w-[164px]',
    },
    // {
    //   y: 620,
    //   delay: 0.2,
    //   speed: 1.2,
    //   src: '/coins/coin-1.png',
    //   className: '-ml-40 left-[45px] lg:ml-0 max-w-[40px] lg:max-w-[80px]',
    // },
    // {
    //   y: 890,
    //   delay: 0.4,
    //   speed: 1.4,
    //   src: '/coins/coin-2.png',
    //   className: '-ml-40 left-[120px] lg:ml-0 max-w-[35px] lg:max-w-[70px]',
    // },
    // {
    //   y: 800,
    //   delay: 0.6,
    //   speed: 1,
    //   src: '/coins/coin-3.png',
    //   className:
    //     '-ml-12 left-1/4 -mt-40 lg:mt-0 lg:ml-0 max-w-[50px] lg:max-w-[90px]',
    // },
    // {
    //   y: 970,
    //   delay: 0.3,
    //   speed: 1.3,
    //   src: '/coins/coin-4.png',
    //   className:
    //     'left-1/3 mt-[-300px] lg:mt-0 -ml-40 lg:ml-0 max-w-[25px] lg:max-w-[50px]',
    // },
    // {
    //   y: 720,
    //   delay: 0.5,
    //   speed: 1.5,
    //   src: '/coins/coin-5.png',
    //   className: 'left-[290px] -ml-40 lg:ml-0 max-w-[40px] lg:max-w-[80px] ',
    // },
    // {
    //   y: 820,
    //   delay: 0.6,
    //   speed: 1.2,
    //   src: '/coins/coin-6.png',
    //   className:
    //     'left-[310px] -ml-40 lg:ml-0 max-w-[45px] lg:max-w-[95px] hidden 2xl:block',
    // },
    // {
    //   y: 900,
    //   delay: 0.7,
    //   speed: 1.4,
    //   src: '/coins/coin-7.png',
    //   className:
    //     'left-[350px] -ml-40 lg:ml-0 max-w-[25px] lg:max-w-[50px] hidden 2xl:block',
    // },
    // {
    //   y: 640,
    //   delay: 0.8,
    //   speed: 1.3,
    //   src: '/coins/coin-8.png',
    //   className:
    //     'left-[360px] -ml-40 lg:ml-0 max-w-[40px] lg:max-w-[80px] hidden 2xl:block',
    // },
    // {
    //   y: 940,
    //   delay: 0.9,
    //   speed: 1.5,
    //   src: '/coins/coin-9.png',
    //   className:
    //     'left-1/2 -ml-20 mt-[-220px] lg:mt-0 lg:-ml-20 max-w-[60px] lg:max-w-[120px]',
    // },
    // {
    //   y: 620,
    //   delay: 0.2,
    //   speed: 1.2,
    //   src: '/coins/coin-10.png',
    //   className:
    //     'left-[680px] -ml-40 lg:ml-0 max-w-[35px] lg:max-w-[70px] hidden lg:block',
    // },
    // {
    //   y: 800,
    //   delay: 0.4,
    //   speed: 1.4,
    //   src: '/coins/coin-11.png',
    //   className:
    //     'mt-[-100px] lg:mt-0 right-1/3 -mr-24 lg:mr-0 max-w-[32px] lg:max-w-[65px]',
    // },
    // {
    //   y: 900,
    //   delay: 0.1,
    //   speed: 1.1,
    //   src: '/coins/coin-12.png',
    //   className:
    //     'right-[350px] -mr-40 lg:mr-0 max-w-[25px] lg:max-w-[50px] hidden 2xl:block',
    // },
    // {
    //   y: 950,
    //   delay: 0.3,
    //   speed: 1.3,
    //   src: '/coins/coin-13.png',
    //   className:
    //     'right-[310px] -mr-40 lg:mr-0 max-w-[45px] lg:max-w-[90px] hidden 2xl:block',
    // },
    // {
    //   y: 900,
    //   delay: 0.5,
    //   speed: 1.5,
    //   src: '/coins/coin-14.png',
    //   className:
    //     'right-[225px] -mr-40 lg:mr-0 max-w-[50px] lg:max-w-[100px] hidden 2xl:block',
    // },
    // {
    //   x: 1100,
    //   y: 700,
    //   delay: 0.6,
    //   speed: 1.2,
    //   src: '/coins/coin-15.png',
    //   className:
    //     'right-[210px] -mr-40 lg:mr-0 max-w-[45px] lg:max-w-[95px] hidden lg:block',
    // },
    // {
    //   y: 650,
    //   delay: 0.7,
    //   speed: 1.4,
    //   src: '/coins/coin-16.png',
    //   className:
    //     'right-[160px] -mr-40 lg:mr-0 max-w-[30px] lg:max-w-[60px] hidden lg:block',
    // },
    // {
    //   y: 700,
    //   delay: 0.8,
    //   speed: 1.3,
    //   src: '/coins/coin-17.png',
    //   className:
    //     'right-[100px] -mr-40 lg:mr-0 max-w-[40px] lg:max-w-[80px] hidden lg:block',
    // },
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
