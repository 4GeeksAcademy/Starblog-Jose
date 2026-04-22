import { useEffect } from "react"
import { Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"

const getImageUrl = (type, uid) =>
  `https://github.com/breatheco-de/swapi-images/blob/master/public/images/${type}/${uid}.jpg?raw=true`

const EntityCard = ({ entity, type }) => {
  const { store, dispatch } = useGlobalReducer()
  const isFav = store.favorites.some(f => f.uid === entity.uid && f.type === type)

  return (
    <div className="card card-fixed-width">
      <img
        src={getImageUrl(type, entity.uid)}
        className="card-img-top"
        alt={entity.name}
        onError={e => {
          e.target.onerror = null
          e.target.src = `https://placehold.co/250x200/1a1a2e/ffd700?text=${encodeURIComponent(entity.name)}`
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{entity.name}</h5>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/${type}/${entity.uid}`} className="btn btn-outline-warning btn-sm flex-grow-1">
            Learn more!
          </Link>
          <button
            className={`btn btn-sm ${isFav ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() =>
              dispatch({
                type: isFav ? "remove_favorite" : "add_favorite",
                payload: { uid: entity.uid, name: entity.name, type }
              })
            }
          >
            <i className="fas fa-heart" style={{ opacity: isFav ? 1 : 0.4 }} />
          </button>
        </div>
      </div>
    </div>
  )
}

const SkeletonCard = () => (
  <div className="card card-fixed-width">
    <div className="card-img-top bg-secondary" style={{ height: 200 }} />
    <div className="card-body placeholder-glow">
      <span className="placeholder col-8 d-block mb-2" />
      <span className="placeholder col-5 d-block" />
    </div>
  </div>
)

const Section = ({ id, title, entities, type }) => (
  <div id={id} className="mb-5">
    <h2 className="section-title">{title}</h2>
    <div className="card-horizontal-scroll">
      {entities.length === 0
        ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        : entities.map(e => <EntityCard key={e.uid} entity={e} type={type} />)}
    </div>
  </div>
)

export const Home = () => {
  const { store, dispatch } = useGlobalReducer()

  useEffect(() => {
    if (store.people.length > 0) return
    const fetchAll = async () => {
      const [pRes, vRes, plRes] = await Promise.all([
        fetch("https://www.swapi.tech/api/people?page=1&limit=10"),
        fetch("https://www.swapi.tech/api/vehicles?page=1&limit=10"),
        fetch("https://www.swapi.tech/api/planets?page=1&limit=10")
      ])
      const [people, vehicles, planets] = await Promise.all([
        pRes.json(), vRes.json(), plRes.json()
      ])
      dispatch({ type: "set_people", payload: people.results })
      dispatch({ type: "set_vehicles", payload: vehicles.results })
      dispatch({ type: "set_planets", payload: planets.results })
    }
    fetchAll()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container-fluid px-4 py-4">
      <Section id="characters" title="Characters" entities={store.people} type="people" />
      <Section id="vehicles" title="Vehicles" entities={store.vehicles} type="vehicles" />
      <Section id="planets" title="Planets" entities={store.planets} type="planets" />
    </div>
  )
}
