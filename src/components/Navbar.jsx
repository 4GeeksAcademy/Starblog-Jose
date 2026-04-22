import { Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

const TYPE_ICON = {
  people: "fa-user",
  vehicles: "fa-car",
  planets: "fa-globe"
}

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer()
  const { favorites } = store

  return (
    <nav className="navbar navbar-dark px-4 py-3">
      <Link to="/" className="navbar-brand fw-bold text-warning fs-4 text-decoration-none">
        <i className="fa fa-star me-2" />STAR WARS
      </Link>

      <div className="ms-auto dropdown">
        <button
          className="btn btn-outline-warning dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa fa-bookmark me-2" />
          Favorites
          {favorites.length > 0 && (
            <span className="badge bg-warning text-dark ms-2">{favorites.length}</span>
          )}
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          {favorites.length === 0 ? (
            <li>
              <span className="dropdown-item text-muted fst-italic">No favorites saved</span>
            </li>
          ) : (
            favorites.map(fav => (
              <li key={`${fav.type}-${fav.uid}`} className="d-flex align-items-center">
                <Link to={`/${fav.type}/${fav.uid}`} className="dropdown-item">
                  <i className={`fas ${TYPE_ICON[fav.type] ?? "fa-star"} me-2`} />
                  {fav.name}
                </Link>
                <button
                  className="btn btn-sm btn-link text-danger pe-3"
                  onClick={() => dispatch({ type: "remove_favorite", payload: fav })}
                >
                  <i className="fa fa-times" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </nav>
  )
}
