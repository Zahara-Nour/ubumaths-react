<script>
  import Filter from './components/Filter.svelte'
  import queryString from 'query-string'
  import ThemesList from './components/ThemesList.svelte'
  import { getCollection } from './collections'
  import Spinner from './components/Spinner.svelte'
  import Select, { Option } from '@smui/select'
  import { lexicoSort } from './utils'
  export let location
  let subject
  let domain
  let grade = '3ème'

  const gradesP = getCollection({
    collectionPath: 'Grades',
    extract: 'name',
    sort: lexicoSort,
  })

  $: {
    const queryParams = queryString.parse(location.search)
    subject = queryParams.subject
    domain = queryParams.domain
  }
</script>

{#await gradesP}
  <Spinner />
{:then grades}
  <Select enhanced bind:value="{grade}" label="Niveau">
    {#each grades as agrade}
      <Option value="{agrade}" selected="{grade === agrade}">{agrade}</Option>
    {/each}
  </Select>
{:catch error}
  {error}
{/await}

<Filter
  label="Matière"
  collectionPath="Subjects"
  let:filters
  defaultValue="{subject}"
>
  <Filter
    label="Domaine"
    collectionPath="Domains"
    defaultValue="{domain}"
    filters="{filters}"
    let:filters
  >
    <ThemesList filters="{filters}" grade="{grade}" />
  </Filter>
</Filter>
