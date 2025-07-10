import React from 'react'
import CountUp from 'react-countup'

interface CountProps {
  bal: number
}

export default function AnimatedCounter({ bal }: CountProps) {
  return (
    <CountUp end={bal} prefix="₦" duration={1.2} separator="," />
  )
}
