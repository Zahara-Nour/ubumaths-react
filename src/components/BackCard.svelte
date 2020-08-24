<script>
  import Button, { Label } from '@smui/button'
  import Spinner from './Spinner.svelte'
  export let card
  export let localUrlP
  export let isLast = false
  export let toggleFlip
  export let onNext
  export let disableNext
  
</script>

<div class="card content">

  <div class="title-answer">Réponse</div>
  <div class="answer textmath">{card.answer}</div>
  {#if localUrlP}
    {#await localUrlP}
      <Spinner />
    {:then localUrl}
      {#if localUrl !== 'none'}
        <img alt="flash card" src="{localUrl}" width="80%" />
      {/if}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  {/if}
  <div class="textmath">{card.explanation}</div>
  <div class="textmath">{card.warning}</div>
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
      on:click="{()=>{toggleFlip();onNext()}}"
      variant="raised"
      class="button-shaped-round"
      color="secondary"
      disabled={disableNext}
    >
      <Label>{isLast ? 'Fin' : 'Suivante'}</Label>
    </Button>
  </div>
</div>

<style type="text/scss">
  @import '../theme/_smui-theme';

  .card {
    -webkit-box-shadow: 0 -1px 1px rgba(230, 188, 188, 0.04),
      0 2px 2px rgba(0, 0, 0, 0.04), 0 4px 4px rgba(0, 0, 0, 0.04),
      0 8px 8px rgba(0, 0, 0, 0.04), 0 16px 16px rgba(0, 0, 0, 0.04);
    box-shadow: 0 -1px 1px rgba(230, 188, 188, 0.04),
      0 2px 2px rgba(0, 0, 0, 0.04), 0 4px 4px rgba(0, 0, 0, 0.04),
      0 8px 8px rgba(0, 0, 0, 0.04), 0 16px 16px rgba(0, 0, 0, 0.04);
    border-radius: 0.25rem;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 1.5rem;
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

  .content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
        -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: distribute;
    justify-content: space-around;
  }

  .textmath {
    display: inline-block;
    margin-top: 15px;
    margin-bottom: 15px;
  }
</style>
