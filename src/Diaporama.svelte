<script>
  import { getLocalUrl } from './localUrl'
  import { shuffle, getLogger } from './utils'
  import FlashCard from './FlashCard.svelte'
  import queryString from 'query-string'
  import { navigate } from 'svelte-routing'
  import { getCollection } from './collections'
  import Spinner from './components/Spinner.svelte'
  import { afterUpdate } from 'svelte'

  export let location

  let queryParams
  let subject, domain, theme, level
  let filters = []
  const { trace } = getLogger('FlashCards', 'trace')
  let cards, cardsP, card_i = -1
  let nextFrontLocalUrlP, nextBackLocalUrlP, frontLocalUrlP, backLocalUrlP
  let disable

  const getCards = async (filters) => {
    // first seek in store

    cardsP = getCollection({
      collectionPath: 'FlashCards',
      filters,
    }).then((values) => {
      trace('crds received, ', values)
      shuffle(values)
      cards = values
      if (cards.length) {
        const card = cards[0]
        nextFrontLocalUrlP = card.image
          ? getLocalUrl(card.image)
          : Promise.resolve('none')
        nextBackLocalUrlP = card.imageAnswer
          ? getLocalUrl(card.imageAnswer)
          : Promise.resolve('none')
        nextCard()
      }
      return values
    })
  }

  function nextCard() {
    card_i++
    console.log('change card', card_i)

    if (card_i == cards.length) {
      navigate(`/flash-cards?subject=${subject}&domain=${domain}`)
    } 
    else {
      frontLocalUrlP = nextFrontLocalUrlP
      backLocalUrlP = nextBackLocalUrlP

      if (card_i < cards.length - 1) {
        disable = true
        const nextcard = cards[card_i + 1]
        nextFrontLocalUrlP = nextcard.image
          ? getLocalUrl(nextcard.image)
          : Promise.resolve('none')
        nextBackLocalUrlP = nextcard.imageAnswer
          ? getLocalUrl(nextcard.imageAnswer)
          : Promise.resolve('none')

        Promise.all([nextFrontLocalUrlP, nextBackLocalUrlP]).then(() => {
          disable = false
        })
      }
    }
  }

  $: {
    queryParams = queryString.parse(location.search)
    subject = queryParams.subject
    domain = queryParams.domain
    theme = queryParams.theme
    level = queryParams.level
    filters = []
    if (subject) filters.push({ subject })
    if (domain) filters.push({ domain })
    if (theme) filters.push({ theme })
    if (level) filters.push({ level })
  }

  $:  getCards(filters)
</script>

{#await cardsP}
  <div class="center">
    <Spinner />
  </div>
{:then cards}
  {#if cards.length}
    {#if card_i >= 0}
      <FlashCard
        card="{cards[card_i]}"
        onNext="{nextCard}"
        preloadImages
        {frontLocalUrlP}
        {backLocalUrlP}
        isLast="{card_i === cards.length - 1}"
        disableNext="{disable}"
      />
    {/if}
  {:else}
    <p style="color: red">liste vide</p>
  {/if}

{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  .center {
    height:90vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
