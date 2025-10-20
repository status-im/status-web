// import { DevTool } from '@hookform/devtools'
import { FormProvider } from 'react-hook-form'

import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'

type Props<Values extends FieldValues> = UseFormReturn<Values> & {
  onSubmit: SubmitHandler<Values>
  children: React.ReactNode
  className?: string
}

const Form = <Values extends FieldValues>(props: Props<Values>) => {
  const { children, onSubmit, className, ...form } = props
  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
          {children}
        </form>
        {/* {process.env.NODE_ENV === 'development' && (
          <DevTool control={form.control} />
        )} */}
      </FormProvider>
    </>
  )
}

export { Form }
