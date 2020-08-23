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
  let isFinished = false
  const { trace } = getLogger('FlashCards', 'trace')
  let cards, cardsP, card_i
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
      card_i = -1
      return values
    })
  }

  function changeCard(i) {
    console.log('change i', i)
    if (!cards || !cards.length) return

    if (i < cards.length - 1) disable = true

    if (i >= 0) {
      frontLocalUrlP = nextFrontLocalUrlP
      backLocalUrlP = nextBackLocalUrlP
    }

    if (i < cards.length - 1) {
      const nextcard = cards[i + 1]
      nextFrontLocalUrlP = nextcard.image
        ? getLocalUrl(nextcard.image)
        : Promise.resolve('none')
      nextBackLocalUrlP = nextcard.imageAnswer
        ? getLocalUrl(nextcard.imageAnswer)
        : Promise.resolve('none')

      Promise.all([nextFrontLocalUrlP, nextBackLocalUrlP]).then(
        () => (disable = false),
      )
      if (card_i === -1) card_i = 0
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

  $: {
    if (isFinished) {
      navigate(`/flash-cards?subject=${subject}&domain=${domain}`)
    }
  }

  $: {
    isFinished = false
    getCards(filters)
  }

  $: changeCard(card_i)

  const handleNextCard = () => {
    if (card_i < cards.length - 1) {
      card_i++
    } else {
      isFinished = true
    }
  }
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
        onNext="{handleNextCard}"
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
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
