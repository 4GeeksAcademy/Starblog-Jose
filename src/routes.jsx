import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"
import { Layout } from "./pages/Layout"
import { Home } from "./pages/Home"
import { Single } from "./pages/Single"

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1 className="text-center mt-5 text-warning">404 — Not found</h1>}>
      <Route path="/" element={<Home />} />
      <Route path="/:type/:uid" element={<Single />} />
    </Route>
  )
)
