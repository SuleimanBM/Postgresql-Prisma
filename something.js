import React from 'react';
import axios from 'axios';

// This function can be called from your form's onSubmit handler.
// It takes user data (e.g., email and password) as an argument.
const handleSignup = async (userData) => {
    try {
        const response = await axios.post(
            'https://api.yourdomain.com/signup', // Your backend API endpoint
            userData // The data object to send in the request body
        );

        // If the request is successful (status code 2xx), Axios returns the response data.
        console.log('Signup successful!', response.data);
        return response.data; // You can return the data for further processing (e.g., showing a success message).

    } catch (error) {
        // If the request fails, Axios throws an error.
        // The error object contains useful information.
        console.error('Signup failed!', error.response ? error.response.data : error.message);
        throw error; // Re-throw the error to be handled by the calling component.
    }
};

// Example of how you would use this function within a React component
const SignupComponent = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            await handleSignup({ email, password });
            alert('User successfully signed up!');
        } catch (err) {
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignupComponent;