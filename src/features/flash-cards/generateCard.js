import { math } from 'tinycas/build/math/math'

export default function generateCard(card) {
    // firestore returns objects with read-only properties
    // console.log('card', card)
  
    let tempCard = {
      enounce: card.enounce,
      variables: {},
      answer: card.answer,
      explanation: card.explanation,
      warning: card.warning,
      theme: card.theme,
      subject: card.subject,
    }
  
    if (card.variables) {
      Object.getOwnPropertyNames(card.variables).forEach((variable) => {
        tempCard.variables[variable] = math(
          card.variables[variable],
        ).generate().string
  
        const regex = new RegExp(variable, 'g')
        const generated = tempCard.variables[variable]
        tempCard.enounce = tempCard.enounce.replace(regex, generated)
        tempCard.answer = tempCard.answer.replace(regex, generated)
        if (tempCard.explanation) {
          tempCard.explanation = tempCard.explanation.replace(regex, generated)
        }
      })
    }
  
    const regex = /\*\*(.*?)\*\*/g
    const replacement = (matched, p1) => {
      return `$$${math(p1).generate().latex}$$`
    }
  
    tempCard.answer = tempCard.answer.replace(regex, replacement)
    tempCard.enounce = tempCard.enounce.replace(regex, replacement)
    if (tempCard.explanation) {
      tempCard.explanation = tempCard.explanation.replace(regex, replacement)
    }
  
    // console.log('newCard', tempCard)
  
    return tempCard
  }