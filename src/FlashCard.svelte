<script>
  import Button, { Label } from '@smui/button'
  import Mathlive from 'mathlive'
  import Fa from 'svelte-fa'
  import { primary } from './colors'
  import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
  import FlipCard from './FlipCard.svelte'
  import Spinner from './components/Spinner.svelte'
  import { afterUpdate } from 'svelte'
  export let card = { enounce: 'énoncé', answer: 'réponse' }
  export let onNext
  export let frontLocalUrlP
  export let backLocalUrlP
  export let isLast = false

  let flip = false
  const toggleFlip = () => (flip = !flip)

  afterUpdate(() => {
    console.log('mathlive')
    Mathlive.renderMathInElement('front')
    Mathlive.renderMathInElement('back')
  })
</script>

<FlipCard flip="{flip}">
  <div id='front' slot="front">
    <div class="info">
      <Fa icon="{faNewspaper}" />
      {card.theme}
    </div>
    <div class="content">
      {card.enounce}
      {#if frontLocalUrlP}
        {#await frontLocalUrlP}
          <Spinner />
        {:then localUrl}
          <img alt="flash card" src="{localUrl}" width="80%" />
        {:catch error}
          <p style="color: red">{error.message}</p>
        {/await}
      {/if}

      <div class="buttons">
        <Button
          on:click="{toggleFlip}"
          variant="raised"
          class="button-shaped-round"
          color="secondary"
        >
          <Label>Réponse</Label>
        </Button>

      </div>
    </div>
  </div>
  <div id='back' slot="back" class="content">
    <div class="title-answer">Réponse</div>
    <div class="answer">{card.answer}</div>
    <div class="buttons">
      <Button
        on:click="{toggleFlip}"
        variant="raised"
        class="button-shaped-round"
        color="secondary"
      >
        <Label>Question</Label>
      </Button>

      <Button
        on:click="{() => {
          if (!isLast) flip = false
          setTimeout(onNext, 250)
        }}"
        variant="raised"
        class="button-shaped-round"
        color="secondary"
      >
        <Label>{isLast ? 'Fin' : 'Suivante'}</Label>
      </Button>
    </div>

  </div>
</FlipCard>

<style type="text/scss">
  @import './theme/_smui-theme';

  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .info {
    // color: $mdc-theme-secondary;
    margin-bottom: 2em;
    font-size: 1.2em;
  }

  .title-answer {
    // color: $mdc-theme-secondary;
    font-size: 1.2em;
    margin-bottom: 2em;
  }
  .answer {
    font-size: 1.4em;
    font-weight: 500;
  }

  .buttons {
    margin-top: 2em;
  }
</style>
