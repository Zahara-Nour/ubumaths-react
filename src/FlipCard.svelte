<script>
  export let flip
  export let height
  let style=''
  if (height) {
    style+='height:{height}px'
  }
</script>

<div class="card" class:flip {style}>
  <div class="flipper">
    <div class="front" {style}>
      <slot name="front">Pas de front</slot>
    </div>
    <div class="back" {style}>
      <slot name="black">Pad de Back</slot>
    </div>
  </div>
</div>

<style type="text/scss">
/* entire container, keeps perspective */
.card {
  perspective: 1000px;
  -webkit-perspective: 1000px;
}
	/* flip the pane when hovered */
 .card.flip .flipper {
  -webkit-transform: rotateY(180deg);
		transform: rotateY(180deg);
	}

.card, .front, .back {
	width: 100%;
}

/* flip speed goes here */
.flipper {
  -webkit-transition: 0.6s;
  -o-transition: 0.6s;
  -webkit-transform-style: preserve-3d;
	transition: 0.6s;
	transform-style: preserve-3d;
	position: relative;
}

/* hide back of pane during swap */
.front, .back {
  -webkit-backface-visibility: hidden;
	backface-visibility: hidden;
	position: absolute;
	top: 0;
	left: 0;
}

/* front pane, placed above back */
.front {
	z-index: 2;
  /* for firefox 31 */

	transform: rotateY(0deg);
}

/* back, initially hidden pane */
.back {
  -webkit-transform: rotateY(180deg);
	transform: rotateY(180deg);
}

</style>
