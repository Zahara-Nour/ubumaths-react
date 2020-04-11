import React from 'react'
import Level from 'react-bulma-components/lib/components/level'
import Button from 'react-bulma-components/lib/components/button'

export default function NumberSelect({ name, value, onClick }) {
  const handlePlus = (e) => {
    e.stopPropagation()

    onClick(value + 1)
  }
  const handleMinus = (e) => {
    e.stopPropagation()

    onClick(value - 1)
  }

  return (
    <Level>
      <Level.Item>
        {name}: {value}
      </Level.Item>
      <Level.Item>
        <Button.Group>
          <Button size="small" onClick={handlePlus}>
            +
          </Button>
          <Button size="small" onClick={handleMinus}>
            -
          </Button>
        </Button.Group>
      </Level.Item>
    </Level>
  )
}
