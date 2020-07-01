import React from 'react'
import { useCollection } from 'app/hooks'
import Button from 'components/CustomButtons/Button'
import { Link } from 'react-router-dom'
import List from 'components/List'
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import { useSelector } from 'react-redux'
import { selectUser } from 'features/auth/authSlice'
import { useHistory } from 'react-router-dom'
import { getLogger } from 'app/utils'

function ThemesList({ id, grade, user }) {
  const {trace} = getLogger('ThemesList')
  const [subject, domain] = id.split('_')
  const uid = useSelector(selectUser).email
  const history = useHistory()
  trace('id : ', id)
  

  const [grades, ,] = useCollection({
    path: 'Grades',
    extract: 'name',
  })
  const [cards, ,] = useCollection({
    path: 'FlashCards',
    filters: user ? [{subject}, {uid}] : [{ subject }, { domain }],
  })
  const [themes, ,] = useCollection({
    path: 'Themes',
    filters: user
      ? [{ subject }, { uid }]
      : [{ domain: `${subject}_${domain}` }],
  })

  trace('cards', cards)
  trace('themes', themes)
  trace('user', user)

  if (! themes || themes.length === 0) return null


  const levelsByThemes = []

  if (!user) {
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
}

  const findLevels = (theme, grade) => {
    const levelsTheme = levelsByThemes.find((l) => l.theme === theme.name)
   
    const levels = grades.reduce((prev, current) => {
    
      return grades.indexOf(current) <= grades.indexOf(grade)
        ? prev.concat(levelsTheme.levels[current])
        : prev
    }, [])
    return levels
  }

  
  

  const buttons = (theme, grade) => {
    const levels = findLevels(theme, grade)

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

  const handleSelect = (theme) => {
    let url = `/flash-cards/user/${subject}/${theme}`
  url =url.replace(/%/g,'%25')
  if (decodeURI(encodeURI(url)) !== url ) console.log ('*** URI malformed', url)
  history.push(encodeURI(url))
}

  return user ? (
    <List elements={themes} onSelect={handleSelect} />
  ) : (
    <List elements={themes}>
      <div render={(theme) => buttons(theme, grade)} />
    </List>
  )
}

export default ThemesList
