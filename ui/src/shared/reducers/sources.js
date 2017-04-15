import _ from 'lodash'

const getInitialState = () => []

const initialState = getInitialState()

const sourcesReducer = (state = initialState, action) => {

export default function sources(state = [], action) {
  switch (action.type) {
    case 'LOAD_SOURCES': {
      return action.payload.sources
    }

    case 'SOURCE_UPDATED': {
      const {source} = action.payload
      const updatedIndex = state.findIndex((s) => s.id === source.id)
      const updatedSources = source.default ? state.map((s) => {
        s.default = false; return s
      }) : [...state]
      updatedSources[updatedIndex] = source
      return updatedSources
    }

    case 'SOURCE_ADDED': {
      const {source} = action.payload
      const updatedSources = source.default ? state.map((s) => {
        s.default = false; return s
      }) : state
      return [...updatedSources, source]
    }

    case 'LOAD_KAPACITORS': {
      const {source, kapacitors} = action.payload
      const sourceIndex = state.findIndex((s) => s.id === source.id)
      const updatedSources = _.cloneDeep(state)
      updatedSources[sourceIndex].kapacitors = kapacitors
      return updatedSources
    }
  }

  return state
}

export default sourcesReducer
