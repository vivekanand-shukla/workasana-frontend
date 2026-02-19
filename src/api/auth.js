
import axios from "axios";
import { Url } from '../customHooks/useMainUrl'
const { url } = Url()
const API_BASE_URL = url; // Backend base URL
// Register User
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData, {
            headers: { "Content-Type": "application/json" },
        });
             
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Registration failed";
    }
};

// Resend OTP
export const resendOtp = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email });


        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to resend OTP";
    }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/verify-otp`,
            { email, otp },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Invalid OTP";
    }
};

// Login User
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, userData, {
            headers: { "Content-Type": "application/json" },
        });

              console.log()
         localStorage.setItem('token', response.data.jwtToken)
        return response.data;
    } catch (error) {
        throw error
    }
};



 