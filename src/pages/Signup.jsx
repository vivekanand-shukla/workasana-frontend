import React from 'react'
import { useState, useEffect } from 'react'
import { registerUser, verifyOtp, resendOtp } from "../api/auth";
import { Url } from '../customHooks/useMainUrl'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
const Signup = () => {
    const { url } = Url()
    const navigate = useNavigate();
    const [otpSent, setOtpSent] = useState(false);



    const [otp, setOtp] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);






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
        e.preventDefault();
        setLoading(true);

        try {
            const response = await registerUser(form);

            if (response?.success === true) {
                toast.success("Signup successful! OTP sent.");
                setShowOtpModal(true);
               
            } else {
                toast.error(response?.message || "Signup failed");
            }

        } catch (err) {
            toast.error("Signup failed");
        } finally {
            setLoading(false);
        }
    };

    // verify opt
    const handleVerifyOtp = async () => {
        try {
            const res = await verifyOtp(form.email, otp);

            toast.success("Email verified!");
            setShowOtpModal(false);
            navigate("/login");
 
        } catch (err) {
            toast.error("Invalid or expired OTP");
        }
    };


    const handleResendOtp = async () => {
        try {
            await resendOtp(form.email);
            toast.success("OTP resent successfully");
            setResendCooldown(60);
            
        } catch (err) {
            toast.error("Failed to resend OTP");
        }
    };



    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown(prev => prev - 1);
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };

    }, [resendCooldown]);



    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh", backgroundColor: "#f8f9fa", padding: "20px" }}>
            {!otpSent && (
                <button
                    type="submit"
                    disabled={loading}
                    onClick={() => setShowOtpModal(true)}
                    style={{
                        padding: "6px 14px",
                        backgroundColor: "#4f46e5",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        marginBottom: "15px",
                        alignSelf: "flex-end",
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>
            )}

            <form onSubmit={handleSignup} className='d-flex justify-content-center flex-column align-items-center' style={{ width: "100%", maxWidth: "380px" }}>
                <h5 style={{ color: "#6366f1", marginBottom: "20px", fontWeight: "600" }}>workasana</h5>
                <h5 style={{ color: "#1f2937", marginBottom: "8px", fontWeight: "600" }}>Sign up to your account</h5>
                <small className='text-secondary' style={{ marginBottom: "30px" }}>Please enter your details</small>

                {/* // */}


                {showOtpModal && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 999
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                maxWidth: "380px",
                                backgroundColor: "#ffffff",
                                padding: "30px",
                                borderRadius: "10px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                textAlign: "center"
                            }}
                        >
                            <h5 style={{ color: "#1f2937", marginBottom: "8px", fontWeight: "600" }}>
                                Verify OTP
                            </h5>

                            <small style={{ color: "#6b7280" }}>
                                Enter the 6-digit OTP sent to your email
                            </small>

                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}


                                maxLength={6}

                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setOtp(value);
                                }}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "20px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    outline: "none",
                                    textAlign: "center",
                                    letterSpacing: "4px"
                                }}
                            />

                            <button
                                disabled={otp.length !== 6}
                                onClick={handleVerifyOtp}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "15px",
                                    backgroundColor: "#4f46e5",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontWeight: "500",

                                    cursor: otp.length !== 6 ? "not-allowed" : "pointer",
                                    opacity: otp.length !== 6 ? 0.6 : 1,

                                }}
                            >
                                Verify OTP
                            </button>

                            <button
                                onClick={handleResendOtp}
                                disabled={resendCooldown > 0}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "10px",
                                    backgroundColor: resendCooldown > 0 ? "#e5e7eb" : "#f3f4f6",
                                    color: "#374151",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: resendCooldown > 0 ? "not-allowed" : "pointer"
                                }}
                            >
                                {resendCooldown > 0
                                    ? `Resend in ${resendCooldown}s`
                                    : "Resend OTP"}
                            </button>
                            <button
                                onClick={() => setShowOtpModal(false)}
                                style={{
                                    marginTop: "15px",
                                    background: "none",
                                    border: "none",
                                    color: "#6b7280",
                                    fontSize: "13px",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>


                        </div>
                    </div>
                )}

                {/*  */}
                <div className='d-flex flex-column gap-3' style={{ width: "100%" }}>
                    <div>
                        <label htmlFor="name" className='d-block' style={{ marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Name</label>
                        <input required
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
                        Sign up

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