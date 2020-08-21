<script>
  import { getCollection } from '../collections'
  import Spinner from './Spinner.svelte'
  import ThemeItem from './ThemeItem.svelte'
  import Button, { Label } from '@smui/button'
  import { lexicoSort, isEmpty } from '../utils'
  import Fab from '@smui/fab'
  import { navigate } from 'svelte-routing'

  export let filters
  export let grade

  let subject
  let domain
  let themesP
  let cardsP
  let promise
  let levels


  let grades
  const gradesP = getCollection({
    collectionPath: 'Grades',
    extract: 'name',
    sort: lexicoSort,
  })
    .then((values) => {
      grades = values
      return values
    })
    .catch((error) => console.log(error))

  const levelsByThemes = {}

  const findLevels = (theme, grade) => {
    const levelsTheme = levelsByThemes[theme]

    const levels = grades.reduce((prev, current) => {
      return grades.indexOf(current) >= grades.indexOf(grade) &&
        levelsTheme[current]
        ? prev.concat(levelsTheme[current])
        : prev
    }, [])
    return levels
  }

  $: if (Array.isArray(filters)) {
    ;[{ subject }, { domain }] = filters
  }

  $: themesP = getCollection({
    collectionPath: 'Themes',
    filters,
    extract: 'name',
  })

  $: cardsP = getCollection({
    collectionPath: 'FlashCards',
    filters,
  }).then((cards) => {
    cards.forEach((card) => {
      const { level, theme, grade } = card

      const levelsTheme = levelsByThemes[theme]
      if (levelsTheme) {
        levelsTheme[grade] = levelsTheme[grade].includes(level)
          ? levelsTheme[grade]
          : levelsTheme[grade].concat(level).sort((a, b) => a - b)
      } else {
        levelsByThemes[theme] = { [grade]: [level] }
      }
    })
    return cards
  })

  $: promise = Promise.all([themesP, cardsP, gradesP]).then(
    ([themes]) => themes,
  )
</script>

{#await promise}
  <Spinner />
{:then themes}
  {#each themes as theme}
    {#if findLevels(theme, grade).length}
      <ThemeItem>
        <div slot="text">{theme}</div>
        <div slot="buttons">
          {#each findLevels(theme, grade) as level}
            <span class="fab">
              <Fab
                mini
                on:click="{() => navigate(`/flash-cards/play?subject=${subject}&domain=${domain}&theme=${theme}&level=${level}`)}"
              >
                {level}
              </Fab>
            </span>
          {/each}
        </div>
      </ThemeItem>
    {/if}
  {/each}
{/await}

<style>
  .fab {
    margin-left: 3px;
    margin-right: 3px;
  }
</style>
