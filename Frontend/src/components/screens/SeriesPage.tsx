import React, { useState, useEffect } from 'react';
import styles from './Series.module.css';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import DeleteModal from '../ui/DeleteModal';
import InfoModal from '../ui/InfoModal';
import axios from 'axios';
import type { Series, Genre } from '../../types';

const API_BASE = 'http://localhost:8080/api';

const SeriesPage = () => {
  const [shows, setShows] = useState<Series[]>([]);
  const navigate = useNavigate(); 
    
  const handleBackClick = () => {
      navigate('/home'); 
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [genres, setGenres] = useState<Genre[]>([]); 
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [editingShow, setEditingShow] = useState<Series | null>(null); 
  const [formData, setFormData] = useState<{
    title: string;
    summary: string;
    duration: string;
    episodes?: string;
    imageUrl: string;
  }>({ title: '', summary: '', duration: '', episodes: '', imageUrl: '' });
  const [showToDelete, setShowToDelete] = useState<Series | null>(null);
  const [showToView, setShowToView] = useState<Series | null>(null);

  const [genreFilter, setGenreFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<string>('asc');


  useEffect(() => {
    loadShows();
    loadGenres(); 
}, [genreFilter, sortOrder]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const genreObjects = selectedGenres.map(id => ({ id: id }));
    
    const showData = {
        title: formData.title,
        summary: formData.summary,
        duration: parseInt(formData.duration) || 0,
        episodes: parseInt(formData.episodes || '0') || 0,
        imageUrl: formData.imageUrl,
        genres: genreObjects,
        status: 'TO_WATCH'
    };

    try {
        if (editingShow) {
            await axios.put(`${API_BASE}/series/${editingShow.id}`, { 
                ...showData,
                status: editingShow.status 
            });
        } else { 
            await axios.post(`${API_BASE}/series`, showData); 
        }
        setFormData({ title: '', summary: '', duration: '', episodes: '', imageUrl: '' });
        setSelectedGenres([]); 
        setEditingShow(null);
        loadShows(); 
        closeModal();
    } catch (error) {
        console.error('Error saving show:', error);
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

  const loadShows = async () => {
    let url = `${API_BASE}/series`;
    const params = new URLSearchParams();
    if (genreFilter) params.append('genre', genreFilter);
    params.append('sort', sortOrder);
    try {
        const response = await axios.get(`${url}?${params.toString()}`);
        setShows(response.data);
    } catch (error) {
        console.error('Error loading shows:', error);
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

    const editShow = (show: Series) => {
    setEditingShow(show);
    
    setFormData({ 
        title: show.title, 
        summary: show.summary, 
        duration: show.duration?.toString() || '', 
        episodes: show.episodes?.toString() || '',
        imageUrl: show.imageUrl 

    });
    if (show.genres) {
        const currentGenreIds = show.genres.map(g => g.id);
        setSelectedGenres(currentGenreIds);
    } else {
        setSelectedGenres([]);
    }

    openModal();
};

    const cancelEdit = () => {
        setEditingShow(null);
        setFormData({ title: '', summary: '', duration: '', episodes: '', imageUrl: '' });
        setSelectedGenres([]);
        closeModal();
    };

    const handleDeleteClick = (show: Series) => {
      setShowToDelete(show);
  };

  const cancelDelete = () => {
      setShowToDelete(null); 
  };

  const confirmDelete = async () => {
      if (!showToDelete) return;

      try {
          await axios.delete(`${API_BASE}/series/${showToDelete.id}`);
          loadShows(); 
          setShowToDelete(null);
      } catch (error) {
          console.error('Error deleting show:', error);
      }
  };

  const nextList = async (show: Series) => {
    let newStatus;
    if (show.status === 'TO_WATCH') {
        newStatus = 'IN_PROGRESS';
    } else {
        newStatus = 'COMPLETED';
    } 
    try {
        await axios.put(`${API_BASE}/series/${show.id}`, { 
            ...show,   
            status: newStatus 
        });
        loadShows(); 
    } catch (error) {
        console.error('Error changing status:', error);
    }
};

const previousList = async (show: Series) => {
    let newStatus;
    if (show.status === 'COMPLETED') {
        newStatus = 'IN_PROGRESS';
    } else {
        newStatus = 'TO_WATCH';
    } 
    try {
        await axios.put(`${API_BASE}/series/${show.id}`, { 
            ...show,   
            status: newStatus 
        });
        loadShows(); 
    } catch (error) {
        console.error('Error changing status:', error);
    }
};

const handleInfoClick = (show: Series) => {
      setShowToView(show);
  };

  const closeInfoModal = () => {
      setShowToView(null);
  };


  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <button onClick={handleBackClick}>← Go Back</button>
        <h1>MY SERIES</h1>
        <button onClick={openModal}>+ Add a Series</button>
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
            {shows
            .filter(show => show.status === 'TO_WATCH')
            .length === 0 ? (
              <p>No series found.</p>
            ) : ( 
              shows
              .filter(show => show.status === 'TO_WATCH')
              .map(show => ( 

                <div key={show.id} className={styles.showItem}>
                  <div>
                    <img className={styles.image} src={show.imageUrl} alt={show.title} />
                  </div>
                  <h3>{show.title}</h3>

                  <div className={styles.showActions}>
                      <button onClick={() => handleInfoClick(show)}> 
                        Info
                      </button>
                      
                      <button onClick={() => editShow(show)}> 
                        Edit
                      </button>
                      
                      <button 
                        className={styles.danger}
                        onClick={() => handleDeleteClick(show)} 
                      >
                        Delete
                      </button>

                      <button 
                        className={styles.secondary}
                        onClick={() => nextList(show)} 
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
            {shows
            .filter(show => show.status === 'IN_PROGRESS')
            .length === 0 ? (
              <p>No series found.</p>
            ) : ( 
              shows
              .filter(show => show.status === 'IN_PROGRESS')
              .map(show => ( 
                <div key={show.id} className={styles.showItem}>
                  <div>
                    <img className={styles.image} src={show.imageUrl} alt={show.title} />
                  </div>
                  <h3>{show.title}</h3>

                  <div className={styles.showActions}>
                      <button 
                        className={styles.secondary}
                        onClick={() => previousList(show)} 
                      >
                        ← 
                      </button>
                      
                      <button onClick={() => handleInfoClick(show)}> 
                        Info
                      </button>

                      <button onClick={() => editShow(show)}> 
                        Edit
                      </button>
                      
                      <button 
                        className={styles.danger}
                        onClick={() => handleDeleteClick(show)} 
                      >
                        Delete
                      </button>

                      <button 
                        className={styles.secondary}
                        onClick={() => nextList(show)} 
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
            {shows
            .filter(show => show.status === 'COMPLETED')
            .length === 0 ? (
              <p>No series found.</p>
            ) : ( 
              shows
              .filter(show => show.status === 'COMPLETED')
              .map(show => ( 
                <div key={show.id} className={styles.showItem}>
                  <div>
                    <img className={styles.image} src={show.imageUrl} alt={show.title} />
                  </div>
                  <h3>{show.title}</h3>

                  <div className={styles.showActions}>
                      <button 
                        className={styles.secondary}
                        onClick={() => previousList(show)} 
                      >
                        ←
                      </button>
                      
                      <button onClick={() => handleInfoClick(show)}> 
                        Info
                      </button>
                      
                      <button onClick={() => editShow(show)}> 
                        Edit
                      </button>
                      
                      <button 
                        className={styles.danger}
                        onClick={() => handleDeleteClick(show)} 
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
                isEditing={!!editingShow}
                entityName="Series"
                cancelEdit={cancelEdit}
                handleSubmit={handleSubmit}
            />
        )}

      <InfoModal 
          closeInfoModal={closeInfoModal} 
          movie={showToView} 

      />

      <DeleteModal 
          cancelDelete={cancelDelete}
          confirmDelete={confirmDelete}
          movieTitle={showToDelete?.title || ''}
          entityName="Series"
      />

</div>
  )
}
export default SeriesPage;