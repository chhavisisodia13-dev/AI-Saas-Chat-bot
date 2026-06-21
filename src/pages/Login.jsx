import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Auth.css";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);

      alert(res.data.message);

      navigate("/dashboard");

    } catch (error) {

      alert(error.response.data.message);

    }

  };

  return (

    <div className="auth-page">

      <div className="auth-container">

        <h1>Welcome Back 👋</h1>

        <p className="auth-subtitle">
          Login to continue chatting with AI
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p className="auth-link">

          Don't have an account?

          <span onClick={() => navigate("/signup")}>

            {" "}Signup

          </span>

        </p>

      </div>

    </div>
  );
}

export default Login;