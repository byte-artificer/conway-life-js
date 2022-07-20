import { createSlice } from '@reduxjs/toolkit'

export const gamestateSlice = createSlice({
  name: 'counter',
  initialState: {
    somethingLoaded: false,
    timerRunning: false,
    timerID: null
  },
  reducers: {
    loadSomething: state => { state.somethingLoaded = true; },
    timerStarted: (state, action) => { timerRunning = true; timerID = action.payload; },
    timerStopped: (state) => {timerRunning = false; timerID = null;}
  }
})

// Action creators are generated for each case reducer function
export const { loadSomething, timerStarted, timerStopped } = gamestateSlice.actions

export default gamestateSlice.reducer