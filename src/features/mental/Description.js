import React from 'react'
import { math } from 'tinycas/build/math/math'
import Card from 'components/Card/Card'
import CardBody from 'components/Card/CardBody'
import { makeStyles } from '@material-ui/core/styles'
import { cardTitle, cardSubtitle, cardLink } from 'assets/jss/main-jss.js'
import Muted from 'components/Typography/Muted'

const styles = {
  cardTitle,
  cardSubtitle,
  cardLink,
}

const useStyles = makeStyles(styles)

function Description({ question, label, children }) {
  const classes = useStyles()
 
  const string =
    question.expressions[
      Math.floor(Math.random() * question.expressions.length)
    ]

  const exp = math(string)

  const mathString = exp.string === 'Error' ? exp.string : exp.generate().string

  if (!question) return <div />

 

  return (
    <Card style={{ width: '15rem' }}>
      <CardBody>
        <h6 className={classes.cardSubtitle}>{label}</h6>

        <p>
          <div
            dangerouslySetInnerHTML={{
              __html:
                question.description +
                '<br><strong>Exemple:</strong> ' +
                mathString,
            }}
          />
        </p>
        {children}
      </CardBody>
    </Card>
  )
}

export default Description
