<script>
  import { collections } from '../stores'
  import Select, { Option } from '@smui/select'
  import { fetchCollection } from '../db'
  import Spinner from './Spinner.svelte'

  import { getCollection } from '../collections'

  export let label
  export let collectionPath
  export let filters = []
  export let defaultValue
  let valuesP
  let newFilters
  let selected

  function initSelect(values) {
    console.log('values received', label)
    selected =
      defaultValue && values.includes(defaultValue) ? defaultValue : values[0]
    defaultValue = null
  }

  $: valuesP = getCollection({
    collectionPath,
    filters,
    thenCallback: initSelect,
    extract: 'name',
  })

  $: {
    if (selected) {
      newFilters = [
        ...filters,
        { [collectionPath.toLowerCase().slice(0, -1)]: selected },
        // selected
      ]
    }
 
  }

  $: {
    console.log('selected', label, selected)
  }
</script>

{#await valuesP}
  <Spinner />

{:then values}
  {#if selected}
    <Select enhanced bind:value="{selected}" label="{label}">
      {#each values as value}
        <Option value="{value}" selected="{selected === value}">{value}</Option>
      {/each}
    </Select>

    <slot filters="{newFilters}" />
  {/if}

{:catch error}
  {label} {error}
{/await}
