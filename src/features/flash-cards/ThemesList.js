import React from 'react'
import { useCollection } from 'app/hooks'
import Button from 'components/CustomButtons/Button'
import { Link } from 'react-router-dom'
import List from 'components/List'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'

function ThemesList({ id, grade }) {
  const [subject, domain] = id.split('_')

  const [grades, , ] = useCollection({
    path: 'Grades',
    extract: 'name',
  })
  const [cards, , ] = useCollection({
    path: 'FlashCards',
    filters: [{ subject }, { domain }],
  })
  const [themes, , ] = useCollection({
    path: 'Themes',
    filters: [{ domain: `${subject}_${domain}` }],
  })



  const levelsByThemes = []
  cards.forEach((card) => {
    const { level, theme, grade } = card
    const levelsTheme = levelsByThemes.find(
      (levelsTheme) => levelsTheme.theme === theme,
    )
    if (levelsTheme) {
      levelsTheme.levels[grade] = levelsTheme.levels[grade].includes(level)
        ? levelsTheme.levels[grade]
        : levelsTheme.levels[grade].concat(level).sort((a, b) => a - b)
    } else {
      levelsByThemes.push({
        theme,
        levels: { [grade]: [level] },
      })
    }
  })

  const findLevels = (theme, grade) => {
    const levelsTheme = levelsByThemes.find((l) => l.theme === theme.name)
    console.log(`levelsTheme for ${theme}`,levelsTheme)
    const levels = grades.reduce(
      (prev, current) => {
        console.log('current', current)
        console.log('grade', grade)
        console.log(grades.indexOf(current) <= grades.indexOf(grade))
        return grades.indexOf(current) <= grades.indexOf(grade)
          ? prev.concat(levelsTheme.levels[current])
          : prev
      },
      [],
    )
    return levels
  }

  const buttons = (theme, grade) => {
    const levels = findLevels(theme, grade)
    console.log('levels', levels)
    return (
      <GridContainer spacing={1}>
        {levels.map((level) => (
          <GridItem>
            <Link
              key={theme.name}
              to={encodeURI(
                `/flash-cards/${subject}/${domain}/${theme.name}/${level}`,
              )}
            >
              <Button size='sm'>{level}</Button>
            </Link>
          </GridItem>
        ))}
      </GridContainer>
    )
  }

  if (themes.length === 0) return null

  return (
    <List elements={themes} >
      <div render={(theme) => buttons(theme, grade)} />
    </List>
  )
}

export default ThemesList
