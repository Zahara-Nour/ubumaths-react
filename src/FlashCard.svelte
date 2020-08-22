<script>
  import Mathlive from 'mathlive'
  import FlipCard from './FlipCard.svelte'
  import { afterUpdate } from 'svelte'
  import BackCard from './components/BackCard.svelte'
  import FrontCard from './components/FrontCard.svelte'
  export let card = { enounce: 'énoncé', answer: 'réponse' }
  export let onNext
  export let frontLocalUrlP
  export let backLocalUrlP
  export let isLast = false
  export let height
  export let disableNext

  let flip = false
  const toggleFlip = () => (flip = !flip)

  const handleNext = () => {
    if (!isLast) flip = false
    setTimeout(onNext, 250)
  }

  afterUpdate(() => {
    console.log('mathlive')
    // Mathlive.renderMathInElement('front')
    // Mathlive.renderMathInElement('back')
  })
</script>

<FlipCard {flip}>
  <div id="front" slot="front">
    <FrontCard {card} localUrlP="{frontLocalUrlP}" {toggleFlip} {height} />
  </div>
  <div id="black" slot="black">
    <BackCard
      {card}
      localUrlP="{backLocalUrlP}"
      {toggleFlip}
      {handleNext}
      {height}
      {disableNext}
      {isLast}
    />
  </div>
</FlipCard>

<style type="text/scss">

</style>
