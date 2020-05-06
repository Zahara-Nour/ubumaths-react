import { createSlice } from '@reduxjs/toolkit'



const initialState = {
  maintenanceMode: false,
}

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    trigerMaintenanceMode(state) {
      state.maintenanceMode = !state.maintenanceMode
    },
  },
})

export const {
  trigerMaintenanceMode
} = maintenanceSlice.actions

const selectMaintenanceMode = (state) => state.maintenance.maintenanceMode


export { selectMaintenanceMode }

export default maintenanceSlice.reducer
