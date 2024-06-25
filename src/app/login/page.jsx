"use client";
import React, { useContext, useState, useEffect } from "react";
import style from "./page.module.css";
import { useRouter } from "next/navigation";
import ShipmentContext from "@/contexts/ShipmentContext";

function Page() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { user, setUser, rem, setRem } = useContext(ShipmentContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    console.log(name, password);

    if (password === "") {
      setError("Password is required");
      valid = false;
    }

    console.log(valid);
    if (valid) {
      try {
        setIsLoading(true);
        const res = await fetch("/api/auth/authentication", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            password,
          }),
        });
        console.log(res.status);
        if (res.status === 200) {
          setIsLoading(false);
          setUser(name);
          if (rem) {
            localStorage.setItem("user", name);
          }
          router.push("/admin");
        } else if (res.status === 400) {
          setIsLoading(false);
          setError("Invalid credentials");
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred");
      }
    }

    if (!valid) return;
  };

  return (
    <section className={style.login}>
      {isLoading && (
        <div className="loadingStuff">
          <div className="loader">
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
          </div>
        </div>
      )}
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={style.pass}>
          <label htmlFor="password">Password</label>
          <input
            type={showPass ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            onClick={() => setShowPass(!showPass)}
            className={`fa ${showPass ? "fa-eye-slash" : "fa-eye"}`}
            aria-hidden="true"
          ></i>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".5em" }}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rem}
            onChange={() => setRem(!rem)}
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red", fontWeight: "600" }}>{error}</p>}
    </section>
  );
}

export default Page;
