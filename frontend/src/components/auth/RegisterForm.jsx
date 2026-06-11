import { useState } from "react";
import { Link } from "react-router-dom";

function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log(formData);

    alert("Register Success");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Create Account
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-6"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
        >
          Register
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-blue-600 font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;