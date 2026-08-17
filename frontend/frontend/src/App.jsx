import { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        formData
      );

      console.log(response.data);

      alert("Signup successful!");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div>
      <h1>Paytm Signup</h1>

      <form onSubmit={handleSignup}>

        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={formData.firstname}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleChange}
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">
          Signup
        </button>

      </form>
    </div>
  );
}

export default App;