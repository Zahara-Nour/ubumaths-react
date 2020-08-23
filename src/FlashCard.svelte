<script>
  import Mathlive from 'mathlive'
  import { afterUpdate } from 'svelte'
  import BackCard from './components/BackCard.svelte'
  import FrontCard from './components/FrontCard.svelte'
  export let card
  export let onNext
  export let frontLocalUrlP
  export let backLocalUrlP
  export let isLast = false
  export let disableNext

  let flip = false
  const toggleFlip = () => (flip = !flip)

  afterUpdate(() => {
    console.log('mathlive')
    // if (!flip) {
    // Mathlive.renderMathInElement('front')
    // } else  {
    // Mathlive.renderMathInElement('back')
    // }
    Mathlive.renderMathInDocument()
  })
</script>

{#if flip}
  <div id="back">
    <BackCard
      {card}
      localUrlP="{backLocalUrlP}"
      {toggleFlip}
      {onNext}
      {disableNext}
      {isLast}
    />
  </div>
{:else}
  <div id="front">
    <FrontCard {card} localUrlP="{frontLocalUrlP}" {toggleFlip} />
  </div>
{/if}

<style type="text/scss">

</style>
