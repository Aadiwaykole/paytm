function Signup() {
  return (
    <div className="signup-page">
      <div className="signup-card">

        <div className="logo">
          Pay<span>tm</span>
        </div>

        <h1>Create your account</h1>

        <p className="subtitle">
          Send money quickly and securely.
        </p>

        <form>
          <div className="name-row">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                placeholder="Aditya"
              />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Waykole"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit">
            Create Account
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span>Sign in</span>
        </p>

      </div>
    </div>
  );
}

export default Signup;