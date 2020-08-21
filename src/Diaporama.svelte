<script>
  import {images} from './stores'
  import { fetchCollection, storage } from './db'
  import { shuffle, getLogger } from './utils'
  import Button, { Label } from '@smui/button'
  import FlashCard from './FlashCard.svelte'
  import queryString from 'query-string'
  import { navigate } from 'svelte-routing'
  import generateCard from './generateCard'
import { getCollection } from './collections';

  export let location

  let queryParams
  let subject
  let domain
  let theme
  let level
  let filters = []
  let isFinished = false
  const { trace } = getLogger('FlashCards', 'trace')
  let cards
  let cardsP
  let card_i
  let frontFirstLocalUrlP
  let backFirstLocalUrlP
  let nextFrontLocalUrlP
  let nextBackLocalUrlP
  let frontLocalUrlP
  let backLocalUrlP

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

  trace('filters', filters)

  $: {
    if (isFinished) {
      navigate(`/flash-cards?subject=${subject}&domain=${domain}`)
    }
  }

  $: {
    frontLocalUrlP = card_i === 0 ? frontFirstLocalUrlP : nextFrontLocalUrlP
    backLocalUrlP = card_i === 0 ? backFirstLocalUrlP : nextBackLocalUrlP
    nextFrontLocalUrlP =
      cards && card_i < cards.length - 1 && cards[card_i + 1].image
        ? getLocalUrl(cards[card_i + 1].image)
        : null
    nextBackLocalUrlP =
      cards && card_i < cards.length - 1 && cards[card_i + 1].imageAnswer
        ? getLocalUrl(cards[card_i + 1].imageAnswer)
        : null
  }

  $: {
    const getCards = async (filters) => {
      // first seek in store

      cardsP = getCollection({
        collectionPath: 'FlashCards',
        filters,
      }).then((values) => {
        trace('crds received, ', values)
        shuffle(values)
        if (values.length) {
          card_i = 0
          const card = values[0]
          frontFirstLocalUrlP = card.image ? getLocalUrl(card.image) : null
          backFirstLocalUrlP = card.imageAnswer
            ? getLocalUrl(card.imageAnswer)
            : null
        }
        cards = values
        return values
      })
    }
    isFinished = false
    getCards(filters)
  }

  const handleNextCard = () => {
    if (card_i < cards.length - 1) {
      card_i++
    } else {
      isFinished = true
    }
  }

  const  getLocalUrl = async (imgPath) => {
    trace('getting image :', imgPath)
    console.log('images store', $images)
    if ($images[imgPath]) {
      trace('image found in store :', imgPath)
      return $images[imgPath]
    }
    
    trace('fetching image :', imgPath)

    return storage
      .child(imgPath)
      .getDownloadURL()
      .then((url) => {
        
        const promise = new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.responseType = 'blob'
          xhr.onload = () => {
            trace('img dowloadeed', imgPath)
            const blob = xhr.response
            const localUrl = URL.createObjectURL(blob)
            images.update(store => {
              store[imgPath] = localUrl
              return store
            })
            console.log('images store', $images)
            resolve(localUrl)
          }
          xhr.onerror = () => {
            reject()
          }
          xhr.open('GET', url)
          xhr.send()
        })
        return promise
      })
      .catch((err) => error('error while fetching image :', err.message))
  }
</script>

{#await cardsP}
  <p>...waiting</p>
{:then cards}
  {#if cards && cards.length}
    <FlashCard
      card="{cards[card_i]}"
      onNext="{handleNextCard}"
      preloadImages
      frontLocalUrlP="{frontLocalUrlP}"
      backLocalUrlP="{backLocalUrlP}"
      isLast="{card_i == cards.length - 1}"
    />
  {:else}
    <p style="color: red">liste vide</p>
  {/if}

{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
