<script lang="ts">
  import { Route, Router } from 'svelte-routing';

  import Nav from './lib/Nav.svelte';
  import AutoLogin from './routes/AutoLogin.svelte';
  import Home from './routes/Home.svelte';
  import ManualLogin from './routes/ManualLogin.svelte';
</script>

<Router>
  <div class="aiq-app">
    <Nav />
    <main class="aiq-main">
      <Route path="/auto" component={AutoLogin} />
      <Route path="/manual" component={ManualLogin} />
      <Route path="/"><Home /></Route>
    </main>
  </div>
</Router>
