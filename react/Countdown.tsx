import React, { useState } from 'react'
import { TimeSplit } from './typings/global'
import { tick } from './utils/time'
import { useCssHandles } from 'vtex.css-handles'
import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import productReleaseDate from './queries/productReleaseDate.graphql'

interface CountdownProps { 
  targetDate: string
}

const CSS_HANDLES = ['countdown']
const DEFAULT_TARGET_DATE = (new Date('2020-06-25')).toISOString()

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ targetDate = DEFAULT_TARGET_DATE }) => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const handles = useCssHandles(CSS_HANDLES)

  tick(targetDate, setTime)

  const { product: { linkText } } = useProduct()
  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
        slug: linkText
    },
    ssr: false
  })
  
  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Erro!</span>
      </div>
    )
  }
  if (!linkText) {
    return (
      <div>
        <span>Não há contexto de produto</span>
      </div>
    )
  }

  return (
    <div className={`${handles.countdown} t-heading-2 fw3 w-100 c-muted-1 db tc`}>
      <h1>{ `${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}` }</h1>
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Data final',
      description: 'Data final utilizada no contador',
      type: 'string',
      default: null,
    }
  },
}

export default Countdown
