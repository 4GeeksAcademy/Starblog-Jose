import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

const SKIP_PROPS = new Set(["created", "edited", "url", "homeworld"])

const getImageUrl = (type, uid) =>
  `https://github.com/breatheco-de/swapi-images/blob/master/public/images/${type}/${uid}.jpg?raw=true`

const isSwapiUrl = (val) => typeof val === "string" && val.includes("swapi.tech/api")

const fetchName = async (url) => {
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data.result?.properties?.name || data.result?.properties?.title || url
  } catch {
    return url
  }
}

export const Single = () => {
  const { type, uid } = useParams()
  const { store, dispatch } = useGlobalReducer()
  const [entity, setEntity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgError, setImgError] = useState(false)
  const [resolvedProps, setResolvedProps] = useState({})

  const isFav = store.favorites.some(f => f.uid === uid && f.type === type)

  useEffect(() => {
    setLoading(true)
    setEntity(null)
    setImgError(false)
    setResolvedProps({})
    fetch(`https://www.swapi.tech/api/${type}/${uid}`)
      .then(r => r.json())
      .then(data => {
        setEntity(data.result)
        setLoading(false)
      })
  }, [type, uid])

  useEffect(() => {
    if (!entity?.properties) return
    const urlEntries = Object.entries(entity.properties).filter(([k, v]) => {
      if (SKIP_PROPS.has(k)) return false
      if (Array.isArray(v)) return v.length > 0 && isSwapiUrl(v[0])
      return isSwapiUrl(v)
    })
    if (urlEntries.length === 0) return

    Promise.all(
      urlEntries.map(async ([key, value]) => {
        if (Array.isArray(value)) {
          const names = await Promise.all(value.map(fetchName))
          return [key, names.join(", ")]
        }
        return [key, await fetchName(value)]
      })
    ).then(entries => setResolvedProps(Object.fromEntries(entries)))
  }, [entity])

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="spinner-border text-warning" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )

  const properties = entity?.properties ?? {}
  const displayProps = Object.entries(properties).filter(([k]) => !SKIP_PROPS.has(k))

  return (
    <div className="container py-5">
      <div className="d-flex gap-3 mb-4">
        <Link to="/" className="btn btn-outline-secondary">
          <i className="fa fa-arrow-left me-2" />Back
        </Link>
        <button
          className={`btn ${isFav ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() =>
            dispatch({
              type: isFav ? "remove_favorite" : "add_favorite",
              payload: { uid, name: properties.name, type }
            })
          }
        >
          <i className="fas fa-heart me-2" />
          {isFav ? "Remove from favorites" : "Add to favorites"}
        </button>
      </div>

      <div className="card detail-card">
        <div className="row g-0">
          {!imgError && (
            <div className="col-md-4">
              <img
                src={getImageUrl(type, uid)}
                className="detail-card-img"
                alt={properties.name}
                onError={() => setImgError(true)}
              />
            </div>
          )}
          <div className={imgError ? "col-12" : "col-md-8"}>
            <div className="card-body p-4">
              <h1 className="text-warning mb-4">{properties.name}</h1>
              <div className="row row-cols-1 row-cols-sm-2 g-0">
                {displayProps.map(([key, value]) => {
                  const display = resolvedProps[key] ?? (Array.isArray(value) ? value.join(", ") : value)
                  return (
                    <div key={key} className="col">
                      <div className="detail-property">
                        <span className="text-warning fw-bold text-capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-end">{display || "n/a"}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
