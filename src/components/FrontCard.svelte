<script>
  import Button, { Label } from '@smui/button'
  import Fa from 'svelte-fa'
  import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
  import Spinner from '../components/Spinner.svelte'
  export let card
  export let localUrlP
  export let toggleFlip = () => {}
  export let height
</script>

<div class="card" style="height:{height}px">
  <div class="info">
    <Fa icon="{faNewspaper}" />
    {card.theme}
  </div>
  <div class="content">
    {card.enounce}
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

<style type="text/scss">
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
    -ms-flex-pack: distribute;
    justify-content: space-around;
    -webkit-box-align: center;
        -ms-flex-align: center;
    align-items: center;
  }

  .info {
    // color: $mdc-theme-secondary;
    margin-bottom: 2em;
    font-size: 1.2em;
  }
</style>
