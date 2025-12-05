import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; 

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', formData);
            
            localStorage.setItem('token', response.data.token);
            
            navigate('/home');
        } catch (err) {
            setError('Error: username already exists.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1>Movie Tracker</h1>
                <h2>Registration Details:</h2>
                
                {error && <p className={styles.error}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="text" 
                            placeholder="Choose a username" 
                            onChange={e => setFormData({...formData, username: e.target.value})} 
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input 
                            type="password" 
                            placeholder="Choose a password" 
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>
                    <button type="submit" className={styles.loginButton}>Sign Up</button>
                </form>
                
                <p className={styles.registerLink}>
                    Have an account? <span onClick={() => navigate('/')}>Log in</span>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;