import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            
            localStorage.setItem('token', response.data.token);
            
            navigate('/home');
        } catch (err) {
            setError('Sorry, your credentials were incorrect.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1>Movie Tracker</h1>
                <h2>Complete with your information:</h2>
                
                {error && <p className={styles.error}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            onChange={e => setFormData({...formData, username: e.target.value})} 
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>
                    <button type="submit" className={styles.loginButton}>Log In</button>
                </form>
                
                <p className={styles.registerLink}>
                    Don't have an account? <span onClick={() => navigate('/register')}>Sign up</span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;