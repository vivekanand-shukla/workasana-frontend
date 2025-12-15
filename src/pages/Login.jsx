import React, { useState } from 'react'
import { Url } from "../customHooks/useMainUrl"
import useCRUD from '../customHooks/useCrud'
import { useNavigate , Link } from "react-router-dom"



const Login = () => {
   const { url } = Url();
    const { CRUD, loading, error } = useCRUD();
const navigate = useNavigate();

    // Form State
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    // Handle input change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    };
    // Handle Login Submit
    const handleLogin = async (e) => {
        e.preventDefault();

        const api = `${url}/auth/login`;

        const response = await CRUD("POST", api, form);
              console.log(error)
        if (response) {
            console.log(response)
            localStorage.setItem("token", response.jwtToken);
            alert("Login Successful!");
              navigate("/", { replace: true });
        } else {
            alert(error || "Login failed");
        }
    };
    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh", backgroundColor: "#f8f9fa", padding: "20px" }}>
            <form  onSubmit={handleLogin}  className='d-flex justify-content-center flex-column align-items-center' style={{ width: "100%", maxWidth: "380px" }}>
                <h5 style={{ color: "#6366f1", marginBottom: "20px", fontWeight: "600" }}>workasana</h5>
                <h5 style={{ color: "#1f2937", marginBottom: "8px", fontWeight: "600" }}>Log in to your account</h5>
                <small className='text-secondary' style={{ marginBottom: "30px" }}>Please enter your details</small>
                
                <div className='d-flex flex-column gap-3' style={{ width: "100%" }}>
                    <div>
                        <label htmlFor="email" className='d-block' style={{ marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Email</label>
                        <input   onChange={handleChange}
                            type="email" 
                            id='email' 
                            placeholder='Enter your email' 
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "14px",
                                outline: "none"
                            }}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className='d-block' style={{ marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Password</label>
                        <input   onChange={handleChange}
                            type="password" 
                            id='password' 
                            placeholder='Password' 
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "14px",
                                outline: "none"
                            }}
                        />
                    </div>
                    
                    <button 
                      type='submit'
                        style={{
                            width: "100%",
                            padding: "10px",
                            // backgroundColor: "#4f46e5",
                            backgroundColor: "rgb(31 88 187)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "15px",
                            fontWeight: "500",
                            cursor: "pointer",
                            marginTop: "8px"
                        }}
                    >
                        Sign in
                    </button>
                </div>
                <p className='my-4'>Don’t have an account?{<><Link to={`/signup`}>Signup </Link></>}  </p>
            </form>
        </div>
    )
}

export default Login