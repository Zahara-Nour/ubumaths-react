<script>
  export let flip = false
</script>

<div class="card" class:flip>
  <div class="flipper">
    <div class="front">
      <slot name="front">Pas de front</slot>
    </div>
    <div class="back">
      <slot name="back">Pad de Back</slot>
    </div>
  </div>
</div>

<style type="text/scss">
  :root {
    --time: 0.60s;
  }

  .card {
   
    perspective: 40rem;
  }

  .flipper {
    border-radius: 0.25rem;
    display: flex;
    transform-style: preserve-3d;
    transition: var(--time) transform;
  }

  .card.flip .flipper {
    transform: rotateY(-180deg);
  }

  .front,
  .back {
    backface-visibility: hidden;
    min-width: 100%;
    box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.04), 0 2px 2px rgba(0, 0, 0, 0.04),
      0 4px 4px rgba(0, 0, 0, 0.04), 0 8px 8px rgba(0, 0, 0, 0.04),
      0 16px 16px rgba(0, 0, 0, 0.04);

    background-color: white;
    box-sizing: border-box;
    padding: 1.5rem;
    border-radius: 0.25rem;
    // border-color: black;
    // border-width: 1px;
    // border-style: solid;
  }

  .back {
    transform: rotateY(-180deg) translate(+100%, 0);
  }

  .front {
    z-index: 2;
  }
</style>
