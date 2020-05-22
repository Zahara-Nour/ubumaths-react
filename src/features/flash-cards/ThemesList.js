import React from 'react'
import { List, ListItem, CircularProgress } from '@material-ui/core'
import { useGrades, useThemes, useCardsLevels } from 'app/hooks'
import Button from 'components/CustomButtons/Button'
import { Link } from 'react-router-dom'

function ThemesList({ domain, subject, grade }) {
  const [grades, , isErrorGrades] = useGrades()
  const [
    cardsLevels,
    isLoadingCardsLevels,
    isErrorCardsLevels,
  ] = useCardsLevels(subject, domain)
  const [themes, isLoadingThemes, isErrorThemes] = useThemes(
    subject,
    domain,
    grade,
  )

  const findLevels = (theme, grade) => {
    const found = cardsLevels.find(
      (card) =>
        card.subject === subject &&
        card.domain === domain &&
        card.theme === theme.label,
    )
    return found
      ? grades.reduce(
          (prev, current) =>
            grades.indexOf(current) <= grades.indexOf(grade)
              ? prev.concat(found.levels[current])
              : prev,
          [],
        )
      : []
  }

  if (themes.length === 0) return null
  return (
    <List>
      {themes.map((theme, index) => (
        <ListItem key={theme}>
          <h4> {theme.label}</h4>

          {findLevels(theme, grade).map((level) => (
            <Link
              to={encodeURI(
                `/flash-cards/${subject}/${domain}/${theme.label}/${level}`,
              )}
            >
              <Button size='sm'>{level}</Button>
            </Link>
          ))}
        </ListItem>
      ))}
    </List>
  )
}

export default ThemesList
