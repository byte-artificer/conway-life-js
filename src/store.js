import { configureStore } from '@reduxjs/toolkit'
import gamestateReducer from './lifegame/redux/gamestateSlice'

export default configureStore({
  reducer: {
    gamestate: gamestateReducer
  }
})