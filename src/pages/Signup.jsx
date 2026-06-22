import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Auth.css";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

      "http://localhost:5000/api/auth/signup",

      formData

    );

    alert(res.data.message);

    navigate("/");

  } catch (error) {

    alert(error.response.data.message);

  }

};

  return (

    <div className="auth-page">

      <div className="auth-container">

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join the AI SaaS Platform
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            onChange={handleChange}
          />

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
            Signup
          </button>

        </form>

        <p className="auth-link">

          Already have an account?

          <span onClick={() => navigate("/login")}>

            {" "}Login

          </span>

        </p>

      </div>

    </div>
  );
}

export default Signup;