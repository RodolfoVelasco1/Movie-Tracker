import React, { useState, useEffect } from 'react';
import styles from './Movies.module.css';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import DeleteModal from '../ui/DeleteModal';
import InfoModal from '../ui/InfoModal';
import axios from 'axios';
import type { Movie, Genre } from '../../types';

const API_BASE = 'http://localhost:8080/api';

const MoviesPage = () => {
  
  const navigate = useNavigate(); 
    
  const handleBackClick = () => {
      navigate('/home'); 
  };
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<Movie | null>(null); 
  const [formData, setFormData] = useState({ title: '', summary: '', duration: '', imageUrl: '' }); 

  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  const [movieToView, setMovieToView] = useState<Movie | null>(null);

  const [genreFilter, setGenreFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<string>('asc');

  useEffect(() => {
    loadMovies();
    loadGenres(); 
}, [genreFilter, sortOrder]);

  const loadMovies = async () => {
    let url = `${API_BASE}/movies`;
    const params = new URLSearchParams();
    if (genreFilter) params.append('genre', genreFilter);
    params.append('sort', sortOrder);
        try {
            const response = await axios.get(`${url}?${params.toString()}`);
            setMovies(response.data);
        } catch (error) {
            console.error('Error loading movies:', error);
        }
  };

  const loadGenres = async () => {
      try {
          const response = await axios.get(`${API_BASE}/genres`);
          setGenres(response.data);
      } catch (error) {
          console.error('Error fetching genres:', error);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const genreObjects = selectedGenres.map(id => ({ id: id }));
    
    const movieData = {
        title: formData.title,
        summary: formData.summary,
        duration: parseInt(formData.duration) || 0,
        imageUrl: formData.imageUrl,
        genres: genreObjects,
        status: 'TO_WATCH'
    };

    try {
        if (isEditing) {
            await axios.put(`${API_BASE}/movies/${isEditing.id}`, { 
                ...movieData,
                status: isEditing.status 
            });
        } else { 
            await axios.post(`${API_BASE}/movies`, movieData); 
        }
        
        setFormData({ title: '', summary: '', duration: '', imageUrl: '' });
        setSelectedGenres([]); 
        setIsEditing(null);
        loadMovies(); 
        closeModal();
    } catch (error) {
        console.error('Error saving movie:', error);
    }
};

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const genreId = parseInt(e.target.value);
      const isChecked = e.target.checked;

      setSelectedGenres(prevGenres => {
          if (isChecked) {
              return [...prevGenres, genreId];
          } else {
              return prevGenres.filter(id => id !== genreId);
          }
      });
  };


  const editMovie = (movie: Movie) => {
    setIsEditing(movie);
    
    setFormData({ 
        title: movie.title, 
        summary: movie.summary, 
        duration: movie.duration?.toString() || '', 
        imageUrl: movie.imageUrl 
    });
    if (movie.genres) {
        const currentGenreIds = movie.genres.map(g => g.id);
        setSelectedGenres(currentGenreIds);
    } else {
        setSelectedGenres([]);
    }

    openModal();
  };

  const cancelEdit = () => {
      setIsEditing(null);
      setFormData({ title: '', summary: '', duration: '', imageUrl: '' });
      setSelectedGenres([]);
      closeModal();
    };

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
  };

  const cancelDelete = () => {
      setMovieToDelete(null); 
  };

  const confirmDelete = async () => {
      if (!movieToDelete) return;

      try {
          await axios.delete(`${API_BASE}/movies/${movieToDelete.id}`);
          loadMovies(); 
          setMovieToDelete(null);
      } catch (error) {
          console.error('Error deleting movie:', error);
      }
  };

  const handleInfoClick = (movie: Movie) => {
      setMovieToView(movie);
  };

  const closeInfoModal = () => {
      setMovieToView(null);
  };


  const nextList = async (movie: Movie) => {
    let newStatus;
    if (movie.status === 'TO_WATCH') {
        newStatus = 'IN_PROGRESS';
    } else {
        newStatus = 'COMPLETED';
    } 
    try {
        await axios.put(`${API_BASE}/movies/${movie.id}`, { 
            ...movie,   
            status: newStatus 
        });
        loadMovies(); 
    } catch (error) {
        console.error('Error changing status:', error);
    }
};

const previousList = async (movie: Movie) => {
    let newStatus;
    if (movie.status === 'COMPLETED') {
        newStatus = 'IN_PROGRESS';
    } else {
        newStatus = 'TO_WATCH';
    } 
    try {
        await axios.put(`${API_BASE}/movies/${movie.id}`, { 
            ...movie,   
            status: newStatus 
        });
        loadMovies(); 
    } catch (error) {
        console.error('Error changing status:', error);
    }
};


  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <button onClick={handleBackClick}>← Go Back</button>
        <h1>MY MOVIES</h1>
        <button onClick={openModal}>+ Add a Movie</button>       
      </div>
      <div className={styles.filters}>
        <div className={styles.genreFilter}>
          <label>Genres:</label>
          <select
            value={genreFilter} 
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">All</option>
            {genres.map(g => ( 
              <option key={g.id} value={g.name}>{g.name}</option> 
            ))}
          </select>
        </div>

        <div className={styles.sortFilter}>
          <label>Sort by Title:</label>
          <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className={styles.sortSelect}
          >
              <option value="asc">A - Z</option>
              <option value="desc">Z - A</option>
          </select>
      </div>
      </div>

      <div className={styles.listContainer}>
        <div className={styles.mylists}>
          <h3>To watch</h3>
          
          <div className={styles.list}>

            {movies
            .filter(movie => movie.status === 'TO_WATCH')
            .length === 0 ? (
              <p>No movies found.</p>
            ) : ( 
              movies
              .filter(movie => movie.status === 'TO_WATCH')
              .map(movie => ( 

                <div key={movie.id} className={styles.movieItem}>
                  <div>
                    <img className={styles.image} src={movie.imageUrl} alt={movie.title} />
                  </div>
                  <h3>{movie.title}</h3>

                  <div className={styles.movieActions}>
                      <button onClick={() => handleInfoClick(movie)}> 
                        Info
                      </button>
                      
                      <button onClick={() => editMovie(movie)}> 
                        Edit
                      </button>
                      
                      <button 
                        className={styles.danger}
                        onClick={() => handleDeleteClick(movie)} 
                      >
                        Delete
                      </button>

                      <button 
                        className={styles.secondary}
                        onClick={() => nextList(movie)} 
                      >
                        →
                      </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
        <div className={styles.mylists}>
          <h3>In Progress</h3>
          
          <div className={styles.list}>
            {movies
            .filter(movie => movie.status === 'IN_PROGRESS')
            .length === 0 ? (
              <p>No movies found.</p>
            ) : ( 
              movies
              .filter(movie => movie.status === 'IN_PROGRESS')
              .map(movie => ( 
                <div key={movie.id} className={styles.movieItem}>
                  <div>
                    <img className={styles.image} src={movie.imageUrl} alt={movie.title} />
                  </div>
                  <h3>{movie.title}</h3>

                  <div className={styles.movieActions}>
                      <button 
                        className={styles.secondary}
                        onClick={() => previousList(movie)} 
                      >
                        ← 
                      </button>
                      
                      <button onClick={() => handleInfoClick(movie)}> 
                        Info
                      </button>

                      <button onClick={() => editMovie(movie)}> 
                        Edit
                      </button>
                      
                      <button 
                        className={styles.danger}
                        onClick={() => handleDeleteClick(movie)} 
                      >
                        Delete
                      </button>

                      <button 
                        className={styles.secondary}
                        onClick={() => nextList(movie)} 
                      >
                        →
                      </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
        <div className={styles.mylists}>
          <h3>Completed</h3>
          
          <div className={styles.list}>
            {movies
            .filter(movie => movie.status === 'COMPLETED')
            .length === 0 ? (
              <p>No movies found.</p>
            ) : ( 
              movies
              .filter(movie => movie.status === 'COMPLETED')
              .map(movie => ( 
                <div key={movie.id} className={styles.movieItem}>
                  <div>
                    <img className={styles.image} src={movie.imageUrl} alt={movie.title} />
                  </div>
                  <h3>{movie.title}</h3>

                  <div className={styles.movieActions}>
                      <button 
                        className={styles.secondary}
                        onClick={() => previousList(movie)} 
                      >
                        ←
                      </button>
                      
                      <button onClick={() => handleInfoClick(movie)}> 
                        Info
                      </button>
                      
                      <button onClick={() => editMovie(movie)}> 
                        Edit
                      </button>
                      
                      <button 
                        className={styles.danger}
                        onClick={() => handleDeleteClick(movie)} 
                      >
                        Delete
                      </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {isModalOpen && (
            <Modal 
                handleCloseModal={closeModal} 
                genres={genres}
                formData={formData}
                setFormData={setFormData}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
                handleGenreChange={handleGenreChange}
                isEditing={!!isEditing}
                entityName="Movie"
                cancelEdit={cancelEdit}
                handleSubmit={handleSubmit}
            />
        )}

      <InfoModal 
          closeInfoModal={closeInfoModal} 
          movie={movieToView} 
      />

      <DeleteModal 
          cancelDelete={cancelDelete}
          confirmDelete={confirmDelete}
          movieTitle={movieToDelete?.title || ''}
          entityName="Movie"
      />


    </div>
  )
}
export default MoviesPage;