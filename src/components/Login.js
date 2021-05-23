import React, { useRef, useState } from "react"
import { Form, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Button from '@material-ui/core/Button';

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      setLoading(false)
      history.push("/dashboard")
    } catch {
      setError("Failed to log in")
    }

  }

  return (
    <div className="auth-container">
      <img className="auth-image" src="auth-page-image.gif"/>
      <div className="auth-area">

        <h2 className="auth-heading">Log In</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" className="auth-input-field" ref={emailRef} required />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" className="auth-input-field" ref={passwordRef} required />
          </Form.Group>
          <Button disabled={loading} variant="contained" color="secondary" className="auth-submit-btn" type="submit">
            Log In
          </Button>
        </Form>
        <div className="auth-links-container">
          <Link to="/forgot-password" className="auth-links">Forgot Password?</Link>
        </div>

        <div>
          Need an account? <Link to="/signup" className="auth-links">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}