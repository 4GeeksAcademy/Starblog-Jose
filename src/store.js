export const initialStore = () => ({
  people: [],
  vehicles: [],
  planets: [],
  favorites: []
})

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_people':
      return { ...store, people: action.payload }
    case 'set_vehicles':
      return { ...store, vehicles: action.payload }
    case 'set_planets':
      return { ...store, planets: action.payload }
    case 'add_favorite': {
      const exists = store.favorites.some(
        f => f.uid === action.payload.uid && f.type === action.payload.type
      )
      if (exists) return store
      return { ...store, favorites: [...store.favorites, action.payload] }
    }
    case 'remove_favorite':
      return {
        ...store,
        favorites: store.favorites.filter(
          f => !(f.uid === action.payload.uid && f.type === action.payload.type)
        )
      }
    default:
      throw Error('Unknown action.')
  }
}
