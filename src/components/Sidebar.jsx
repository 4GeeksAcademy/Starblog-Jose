import { useLocation, useNavigate, Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

const NAV_ITEMS = [
  { label: "Characters", icon: "fa-user", id: "characters" },
  { label: "Planets", icon: "fa-globe", id: "planets" },
  { label: "Vehicles", icon: "fa-car", id: "vehicles" }
]

const TYPE_ICON = {
  people: "fa-user",
  vehicles: "fa-car",
  planets: "fa-globe"
}

export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer()
  const { favorites } = store

  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 150)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <aside className="sidebar">
      <ul className="list-unstyled m-0 pt-3">
        {NAV_ITEMS.map(({ label, icon, id }) => (
          <li key={id}>
            <button className="sidebar-link w-100 text-start border-0 bg-transparent" onClick={() => scrollTo(id)}>
              <i className={`fas ${icon} me-3`} />
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar-divider" />

      <div className="sidebar-section-title">
        <i className="fas fa-heart me-2" />
        Favorites
        {favorites.length > 0 && (
          <span className="badge bg-warning text-dark ms-2">{favorites.length}</span>
        )}
      </div>

      <ul className="list-unstyled m-0">
        {favorites.length === 0 ? (
          <li className="sidebar-empty">No favorites yet</li>
        ) : (
          favorites.map(fav => (
            <li key={`${fav.type}-${fav.uid}`} className="sidebar-fav-item">
              <Link to={`/${fav.type}/${fav.uid}`} className="sidebar-fav-link">
                <i className={`fas ${TYPE_ICON[fav.type] ?? "fa-star"} me-2`} />
                <span className="sidebar-fav-name">{fav.name}</span>
              </Link>
              <button
                className="sidebar-fav-remove"
                onClick={() => dispatch({ type: "remove_favorite", payload: fav })}
              >
                <i className="fa fa-times" />
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  )
}
