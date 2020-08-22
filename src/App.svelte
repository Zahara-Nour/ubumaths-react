<script>
  import FlashCard from './FlashCard.svelte'
  import FlashCards from './FlashCards.svelte'
  import { Router, Link, Route } from 'svelte-routing'
  import Home from './routes/Home.svelte'
  import About from './routes/About.svelte'
  import Button from '@smui/button/Button.svelte'
  import FlipCard from './FlipCard.svelte'
  import Group from '@smui/button/Group.svelte'
  import Diaporama from './Diaporama.svelte'
  export let url = ''
</script>

<Router url="{url}">

  <nav>
    <Link to="/">Home</Link>
    <Link to="about">About</Link>
    <Link to="flash-cards">Flash cards</Link>
  </nav>
  <div class="main">
    <Route path="about/:id/:id2" let:params>
      <About {...params} />
    </Route>
    <Route path="flash-cards/play" let:location>
      <Diaporama {location} />
    </Route>
    <Route path="flash-cards" let:location>
      <FlashCards {location} />
    </Route>
    <Route path="/">
      <Home />
    </Route>
  </div>

</Router>

<style type="text/scss">
  @import 'style/_include-media';

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;

    @include media('<desktop') {
      display: none;
    }
  }

  .main {
    position: relative;
  }
</style>
