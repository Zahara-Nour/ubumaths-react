import React from 'react'
import Content from 'react-bulma-components/lib/components/content'
import Box from 'react-bulma-components/lib/components/box'
import { math } from 'tinycas/build/math/math'

export default function Description({ question }) {
  if (!question) return <div />
  
  console.log(question.subcategory)
console.log(question.description)
  return (
    <Box>
      <Content>
        <div
          dangerouslySetInnerHTML={{
            __html:
              question.description +
              '<br><strong>Exemple:</strong> ' +
              math(
                question.expressions[
                  Math.floor(Math.random() * question.expressions.length)
                ],
              ).generate().string,
          }}
        />
      </Content>
    </Box>
  )
}
