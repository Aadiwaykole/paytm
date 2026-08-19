import { useState } from "react";
import axios from "axios";






function Signup() {

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("BUTTON CLICK")

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        formData
      );

      const token = response.data.token;

      localStorage.setItem("token", token);

      console.log("Signup successful");
      console.log("Token:", token);

    } catch (error) {
      console.log(error.response?.data);
    }
  };



 return (
  <div>
    <h1>Signup Page</h1>

    <form onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Aditya"
        value={formData.firstname}
        onChange={(e) =>
          setFormData({
            ...formData,
            firstname: e.target.value
          })
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastname}
        onChange={(e) =>
          setFormData({
            ...formData,
            lastname: e.target.value
          })
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) =>
          setFormData({
            ...formData,
            username: e.target.value
          })
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) =>
          setFormData({
            ...formData,
            password: e.target.value
          })
        }
      />

      <br /><br />

      <button type="submit">
        Sign Up
      </button>

    </form>
  </div>
);
}



export default Signup;