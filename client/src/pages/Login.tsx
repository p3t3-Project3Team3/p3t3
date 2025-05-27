import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import "semantic-ui-css/semantic.min.css";
import "../styles/Loginstyle.css";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";

import Auth from "../utils/auth";

const Login = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);
  const [redirectToSignup, setRedirectToSignup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await login({ variables: { ...formState } });
      Auth.login(data.login.token);
      navigate("/Home");
    } catch (e) {
      console.error(e);
    }

    setFormState({ email: "", password: "" });
  };

  if (redirectToSignup) {
    return <Navigate to="/signup" />;
  }


  return (
    <>

        <div className="ui segment">
          <div className="ui two column very relaxed grid">
            <div className="column">
              <h4>Login</h4>
              <form onSubmit={handleFormSubmit} className="ui form">
                <div className="field">
                  <label>Email</label>
                  <div className="ui left icon input">
                    <input
                      placeholder="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                    />
                    <i className="envelope icon"></i>
                  </div>
                </div>
                <div className="field">
                  <label>Password</label>
                  <div className="ui left icon input">
                    <input
                      placeholder="******"
                      name="password"
                      type="password"
                      value={formState.password}
                      onChange={handleChange}
                    />
                    <i className="lock icon"></i>
                  </div>
                </div>
                <button type="submit" className="ui purple submit button">
                  Login
                </button>
              </form>

              {error && (
                <div className="ui negative message">
                  <div className="header">Login failed</div>
                  <p>{error.message}</p>
                </div>
              )}
            </div>
      <Signup />
          </div>
            <div className="ui vertical divider">
    or
  </div>
        </div>
    </>
  );
};

export default Login;
