import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate(); 
    
    const handleMoviesClick = () => {
        navigate('/movies'); 
    };
    const handleSeriesClick = () => {
        navigate('/series');
    };

    const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className={styles.mainContainer}>
        <div className={styles.mainContent}>
            <h1>Welcome back!</h1>
            <h2>What are you going to watch today?</h2>
        </div>
        <div>
            <button className={styles.button} onClick={handleMoviesClick}>Movies</button>
            <button className={styles.button} onClick={handleSeriesClick}>Series</button>
        </div>
        <div className={styles.LogoutButton}>
            <button className={styles.button} onClick={handleLogout}>Logout</button>
        </div>
    </div>
  )
}
export default Home;