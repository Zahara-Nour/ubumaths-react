import React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import dbReducer from 'features/db/dbSlice'
import authReducer from 'features/auth/authSlice'

import { fetchCollection } from 'features/db/db'
import Filter from './Filter'
import { Provider } from 'react-redux'

const reducers = combineReducers({
  db: dbReducer,
  auth: authReducer,
})

const CleanDiv = ({ children }) => <div>{children}</div>

jest.mock('features/db/db')

it("shouldn't display when elements list is empty", async () => {
  const docs = []
  let promise = Promise.resolve(docs)
  fetchCollection.mockImplementation(() => promise)

  const store = configureStore({
    reducer: reducers,
  })

  render(
    <Provider store={store}>
      <Filter path='rr' label='myfilter' />
    </Provider>,
  )

  await act(() => promise)

  // screen.getByRole('button', {id:'filter myfilter'})
  expect(screen.queryByText('myfilter')).not.toBeInTheDocument()
})

it('renders with first value', async () => {
  const store = configureStore({
    reducer: reducers,
  })
  const docs = [{ name: 'value 1' }, { name: 'value 2' }, { name: 'value 3' }]
  const promise = Promise.resolve(docs)
  fetchCollection.mockImplementation(() => promise)

  render(
    <Provider store={store}>
      <Filter path='mycollection' label='myfilter' />
    </Provider>,
  )
  await act(() => promise)
  expect(screen.getByText('value 1')).toBeInTheDocument()
})

it('uses defaults', async () => {
  const store = configureStore({
    reducer: reducers,
  })
  const docs = [{ name: 'value 1' }, { name: 'value 2' }, { name: 'value 3' }]
  const promise = Promise.resolve(docs)
  fetchCollection.mockImplementation(() => promise)

  render(
    <Provider store={store}>
      <Filter
        path='mycollection'
        label='myfilter'
        defaultFilters={[{ filter: 'value 2' }]}
      />
    </Provider>,
  )
  await act(() => promise)
  expect(screen.getByText('value 2')).toBeInTheDocument()
})

it('renders children when  element is set', async () => {
  const store = configureStore({
    reducer: reducers,
  })
  const docs = [{ name: 'value 1' }, { name: 'value 2' }, { name: 'value 3' }]
  const promise = Promise.resolve(docs)
  fetchCollection.mockImplementation(() => promise)

  render(
    <Provider store={store}>
      <Filter path='myfilter' label='myfilter'>
        <CleanDiv> chidren text</CleanDiv>
      </Filter>
    </Provider>,
  )
  expect(screen.queryByText('chidren text')).not.toBeInTheDocument()
  await act(() => promise)
  expect(screen.getByText('chidren text')).toBeInTheDocument()
})

it('renders 2 nested fillters', async () => {
  const store = configureStore({
    reducer: reducers,
  })
  const docs1 = [
    { name: 'value 1-1' },
    { name: 'value 1-2' },
    { name: 'value 1-3' },
  ]

  const docs2 = [
    { name: 'value 2-1' },
    { name: 'value 2-2' },
    { name: 'value 2-3' },
  ]
  let promise1

  const getDocuments = (path) => {
    switch (path) {
      case 'collection1':
        return docs1
      case 'collection2':
        return docs2
      default:
        return []
    }
  }

  fetchCollection.mockImplementation(({ path }) => {
    promise1 = Promise.resolve(getDocuments(path))

    return promise1
  })

  render(
    <Provider store={store}>
      <Filter path='collection1'>
        <Filter path='collection2' />
      </Filter>
    </Provider>,
  )
  expect(screen.queryByText('value 1-1')).not.toBeInTheDocument()
  expect(screen.queryByText('value 2-1')).not.toBeInTheDocument()

  await act(() => promise1)

  expect(screen.getByText('value 1-1')).toBeInTheDocument()
  expect(screen.getByText('value 2-1')).toBeInTheDocument()
})

it('renders 2 nested filters with defaults', async () => {
  const store = configureStore({
    reducer: reducers,
  })
  const docs1 = [
    { name: 'value 1-1' },
    { name: 'value 1-2' },
    { name: 'value 1-3' },
  ]

  const docs2 = [
    { name: 'value 2-1' },
    { name: 'value 2-2' },
    { name: 'value 2-3' },
  ]
  let promise1

  const getDocuments = (path) => {
    switch (path) {
      case 'collection1':
        return docs1
      case 'collection2':
        return docs2
      default:
        return []
    }
  }

  fetchCollection.mockImplementation(({ path }) => {
    promise1 = Promise.resolve(getDocuments(path))

    return promise1
  })

  render(
    <Provider store={store}>
      <Filter
        path='collection1'
        label='filter1'
        defaultFilters={[{ filter: 'value 1-2' }, { filter: 'value 2-3' }]}
      >
        <Filter path='collection2' label='filter2' />
      </Filter>
    </Provider>,
  )

  await act(() => promise1)

  expect(screen.getByText('value 1-2')).toBeInTheDocument()
  expect(screen.getByText('value 2-3')).toBeInTheDocument()
})

const CheckProps = ({ filters, element }) => {
  const filtersString = filters.reduce((acc, filter) => {
    const name = Object.getOwnPropertyNames(filter)[0]
    const value = filter[name]
    return acc ? acc + '/' + value : value
  }, '')

  return <div>{filtersString}</div>
}

it('passes filters through', async () => {
  const store = configureStore({
    reducer: reducers,
  })
  const docs1 = [
    { name: 'value 1-1' },
    { name: 'value 1-2' },
    { name: 'value 1-3' },
  ]

  const docs2 = [
    { name: 'value 2-1' },
    { name: 'value 2-2' },
    { name: 'value 2-3' },
  ]
  let promise1

  const getDocuments = (path) => {
    switch (path) {
      case 'collection1':
        return docs1
      case 'collection2':
        return docs2
      default:
        return []
    }
  }

  fetchCollection.mockImplementation(({ path }) => {
    promise1 = Promise.resolve(getDocuments(path))

    return promise1
  })

  render(
    <Provider store={store}>
      <Filter
        path='collection1'
        label='filter1'
        filterName='filter1'
        defaultFilters={[{ filter: 'value 1-2' }, { filter: 'value 2-3' }]}
      >
        <Filter path='collection2' label='filter2' filterName='filter2'>
          <CheckProps />
        </Filter>
      </Filter>
    </Provider>,
  )

  await act(() => promise1)

  expect(screen.getByText('value 1-2/value 2-3')).toBeInTheDocument()
})

it('passes filters through (with defaults)', async () => {
  const store = configureStore({
    reducer: reducers,
  })
  const docs1 = [
    { name: 'value 1-1' },
    { name: 'value 1-2' },
    { name: 'value 1-3' },
  ]

  const docs2 = [
    { name: 'value 2-1' },
    { name: 'value 2-2' },
    { name: 'value 2-3' },
  ]
  let promise1

  const getDocuments = (path) => {
    switch (path) {
      case 'collection1':
        return docs1
      case 'collection2':
        return docs2
      default:
        return []
    }
  }

  fetchCollection.mockImplementation(({ path }) => {
    promise1 = Promise.resolve(getDocuments(path))

    return promise1
  })

  render(
    <Provider store={store}>
      <Filter path='collection1' label='filter1' filterName='filter1'>
        <Filter path='collection2' label='filter2' filterName='filter2'>
          <CheckProps />
        </Filter>
      </Filter>
    </Provider>,
  )

  await act(() => promise1)

  expect(screen.getByText('value 1-1/value 2-1')).toBeInTheDocument()
})

it('sets new element after clicking', async () => {
  const store = configureStore({
    reducer: reducers,
  })
  const docs = [{ name: 'value 1' }, { name: 'value 2' }, { name: 'value 3' }]

  let promise1

  fetchCollection.mockImplementation(({ path }) => {
    promise1 = Promise.resolve(docs)
    return promise1
  })

  render(
    <Provider store={store}>
      <Filter path='collection' />
    </Provider>,
  )

  await act(() => promise1)
  expect(screen.getByText('value 1')).toBeInTheDocument()
  expect(screen.queryByText('value 2')).not.toBeInTheDocument()

  const buttons = screen.getAllByRole('button')
  await userEvent.click(buttons[0])
  expect(screen.getByText('value 2')).toBeInTheDocument()
  expect(screen.getByText('value 3')).toBeInTheDocument()

  const options = screen.getAllByRole('option')

  await userEvent.click(options[2])

  // expect(screen.queryByText('value 1')).not.toBeInTheDocument()
  // expect(screen.getByText('value 2')).toBeInTheDocument()
  // expect(screen.queryByText('value 3')).not.toBeInTheDocument()
})
