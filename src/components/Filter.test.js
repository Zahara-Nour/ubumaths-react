import React from 'react'
import { render, screen, act } from '@testing-library/react'

import { fetchCollection } from 'features/db/db'
import Filter from './Filter'
import { store } from 'app/store'
import { Provider } from 'react-redux'

jest.mock('features/db/db')

it('renders welcome message', async () => {
  const docs = [{ id: 1, field: 'field' }]
  const promise = Promise.resolve(docs)
  fetchCollection.mockImplementation(() => promise)
  console.log(fetchCollection())

  render(
    <Provider store={store}>
      <Filter path='toto' />
    </Provider>,
  )
  await act(() => promise);

  screen.debug()
})
