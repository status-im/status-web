// TODO restrict colors and have a diciontary of colors and classnames

type Props = {
  backgroundColor: string // Should be only 'purple' | 'turquoise' | 'yellow'
  borderColor: string
  cardOne: {
    image: string
    alt: string
  }
  cardTwo: {
    image: string
    alt: string
  }
  cardThree: {
    image: string
    alt: string
    alignment?: 'top' | 'bottom'
  }
  cardFour: {
    image: string
    alt: string
  }
}

const GridHero = (props: Props) => {
  const {
    backgroundColor,
    borderColor,
    cardOne,
    cardTwo,
    cardThree,
    cardFour,
  } = props

  return (
    <div className="relative z-[2] flex w-full max-w-[1504px] justify-start overflow-x-auto px-5 sm:justify-center sm:px-10">
      <div className="flex min-w-[712px] flex-row gap-3 sm:min-w-fit sm:flex-col sm:gap-5 lg:flex-row">
        <div className="flex flex-row gap-3 sm:gap-5">
          <div
            className={`${backgroundColor} min-w-[350px] rounded-[40px] px-[22px] py-6 sm:min-w-0 sm:px-[35px] sm:py-[48px] lg:px-5 xl:px-[34px] xl:py-[68px] 2xl:px-[73px]`}
          >
            <img
              src={cardOne.image}
              alt={cardOne.alt}
              className={`${borderColor} rounded-3xl border-4`}
            />
          </div>
          <div
            className={`${backgroundColor} min-w-[350px] rounded-[40px] px-[22px] py-6 sm:min-w-0 sm:px-[35px] sm:py-[48px] lg:px-5 xl:px-[34px] xl:py-[68px] 2xl:px-[73px]`}
          >
            <img
              src={cardTwo.image}
              alt={cardTwo.alt}
              className={`${borderColor} rounded-3xl border-4`}
            />
          </div>
        </div>
        <div className="flex min-w-[350px] flex-col gap-3 pr-5 sm:min-w-0 sm:flex-row sm:gap-5 sm:pr-0 lg:flex-col">
          <div
            className={`${backgroundColor} flex min-w-[calc(50%-10px)] items-end justify-end rounded-[40px] px-[22px] pb-0 pt-6 sm:px-[35px] sm:pt-[48px] lg:px-5 xl:px-[34px] xl:pt-[68px] 2xl:px-[73px]`}
          >
            <img
              src={cardThree.image}
              alt={cardThree.alt}
              className={`${borderColor}  rounded-3xl rounded-b-none border-4 border-b-0`}
            />
          </div>
          <div
            className={`${backgroundColor} flex min-w-[calc(50%-10px)] flex-grow items-center justify-center rounded-[40px] px-0 sm:px-5 md:px-10 lg:px-5 2xl:px-10`}
          >
            <img src={cardFour.image} alt={cardFour.alt} />
          </div>
        </div>
      </div>
    </div>
  )
}

export { GridHero }
