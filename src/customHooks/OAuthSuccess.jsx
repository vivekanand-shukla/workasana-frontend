import { useEffect } from "react"
import { useLocation } from "react-router-dom"

function OAuthSuccess() {

  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get("token")

    if (token) {
      localStorage.setItem("token", token)
      window.location.href = "/"
    } else {
      window.location.href = "/login"
    }
  }, [])

  return <h2>Authenticating...</h2>
}

export default OAuthSuccess
