import React from 'react'
import { useState } from 'react'
import { Url } from "../customHooks/useMainUrl"
import useCRUD from '../customHooks/useCrud'
import { Link } from 'react-router-dom'

const Signup = () => {

    // url → Url/auth/signup
    const { url } = Url();
    const { CRUD, loading, error } = useCRUD();

    // State values
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    // Handle Input Change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    };

    // Handle Signup Submit
    const handleSignup = async (e) => {
        e.preventDefault()

        const api = `${url}/auth/signup`;

        const response = await CRUD("POST", api, form);

        if (response) {
            alert("Signup successful!");
        } else {
            alert(error || "Signup failed");
        }
    };


    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh", backgroundColor: "#f8f9fa", padding: "20px" }}>
            <form    onSubmit={handleSignup} className='d-flex justify-content-center flex-column align-items-center' style={{ width: "100%", maxWidth: "380px" }}>
                <h5 style={{ color: "#6366f1", marginBottom: "20px", fontWeight: "600" }}>workasana</h5>
                <h5 style={{ color: "#1f2937", marginBottom: "8px", fontWeight: "600" }}>Sign up to your account</h5>
                <small className='text-secondary' style={{ marginBottom: "30px" }}>Please enter your details</small>

                <div className='d-flex flex-column gap-3' style={{ width: "100%" }}>
                    <div>
                        <label htmlFor="name" className='d-block' style={{ marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Name</label>
                        <input
                            type="name"
                            id='name'
                            placeholder='Enter your name'
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "14px",
                                outline: "none"
                            }}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className='d-block' style={{ marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Email</label>
                        <input
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
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className='d-block' style={{ marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Password</label>
                        <input
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
                            onChange={handleChange}
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
                    <p>Already have an account ?{<><Link to={`/login`}>Login </Link></>}  </p>
                </div>
            </form>
        </div>
    )
}

export default Signup