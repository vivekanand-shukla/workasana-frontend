import React from 'react'
import { useState } from 'react'
import { Url } from "../customHooks/useMainUrl"
import useCRUD from '../customHooks/useCrud'
import { Link } from 'react-router-dom'
import { useNavigate  } from "react-router-dom"
import { toast } from "react-toastify";
const Signup = () => {
   const navigate = useNavigate();


    const { url } = Url();
    const { CRUD, loading, error } = useCRUD();


    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    };


    const handleSignup = async (e) => {
        e.preventDefault()

        const api = `${url}/auth/signup`;

        const response = await CRUD("POST", api, form);

        if (response?.success === true) {
            // console.log(response)
            toast.success("Signup successful!");
              navigate("/login", { replace: true });
        }
         else {
            toast.error( "Signup failed ");
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
                        <input  required
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
                        required
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
                        required
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
                          
                            backgroundColor: "#4f46e5",
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
                  
                    
            {/* ===== Social Login Section Start ===== */}

<div style={{ marginTop: "20px" }}>

  <div style={{
    display: "flex",
    alignItems: "center",
    marginBottom: "15px"
  }}>
    <div style={{ flex: 1, height: "1px", background: "#ccc" }} />
    <span style={{ margin: "0 10px", fontSize: "14px", color: "#888" }}>
      OR
    </span>
    <div style={{ flex: 1, height: "1px", background: "#ccc" }} />
  </div>

  <button
    type="button"
    onClick={() => window.location.href = `${url}/auth/google`}
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      background: "#fff",
      color: "#000",
      fontWeight: "500",
      cursor: "pointer",
      marginBottom: "10px"
    }}
  >
    Continue with Google
  </button>

  <button
    type="button"
    onClick={() => window.location.href = `${url}/auth/github`}
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "none",
      background: "#000",
      color: "#fff",
      fontWeight: "500",
      cursor: "pointer"
    }}
  >
    Continue with GitHub
  </button>

</div>

{/* ===== Social Login Section End ===== */}
  <p className='my-4'>Already have an account ?{<><Link to={`/login`}>Login </Link></>}  </p>
            </form>


        </div>
    )
}

export default Signup