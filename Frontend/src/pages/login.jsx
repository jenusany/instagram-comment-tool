import React, { useState } from "react";
import "./login.css";


function Login({method}) {

  localStorage.getItem("")

  return (
    <div className="contain">
        <form onSubmit={method} className="form">
          <div className="center">
          <h2>Log into your Facebook Business Account</h2>
          <button type="submit" onClick={method} className="arrow-button">
            Facebook
          </button>
          </div>
        </form>
    </div>
  );
}

export default Login;
