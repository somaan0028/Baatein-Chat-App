import React, { useRef, useState } from "react"
import { Form, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Button from '@material-ui/core/Button';

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      setLoading(false)
      history.push("/dashboard")
    } catch {
      setError("Failed to create an account")
    }

  }

  return (
    <div className="auth-container">
      <img className="auth-image" src="auth-page-image.gif"/>
      <div className="auth-area">

        <h2 className="auth-heading">Sign Up</h2>
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
          <Form.Group id="password-confirm">
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control type="password" className="auth-input-field" ref={passwordConfirmRef} required />
          </Form.Group>
          <Button disabled={loading} variant="contained" color="secondary" className="auth-submit-btn" type="submit">
            Sign Up
          </Button>
        </Form>
        <div className="auth-links-container">
          Already have an account? <Link to="/login" className="auth-links">Log In</Link>
        </div>
      </div>
    </div>
  )
}