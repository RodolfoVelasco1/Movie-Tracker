import React from 'react';
import styles from './Modal.module.css';
import type { Movie, Series } from '../../types';

interface InfoModalProps {
    closeInfoModal: () => void;
    movie: Movie | Series | null;
}

const InfoModal: React.FC<InfoModalProps> = ({ closeInfoModal, movie }) => {
    if (!movie) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.formContainer}>
                    
                    <h2 className={styles.infoTitle}>{movie.title}</h2>

                    <div className={styles.infoLayout}>
                        
                        <div>
                             {movie.imageUrl ? (
                                <img 
                                    src={movie.imageUrl} 
                                    alt={movie.title} 
                                    className={styles.infoImage} 
                                />
                             ) : (
                                 <div className={styles.noImagePlaceholder}>No Image</div>
                             )}
                        </div>

                        <div className={styles.infoDetails}>
                            <p><strong>Duration:</strong> {movie.duration} min</p>

                            {'episodes' in movie && (
                                <p><strong>Episodes:</strong> {movie.episodes}</p>
                            )}
                            
                            <p><strong>Genres:</strong> {movie.genres ? movie.genres.map(g => g.name).join(', ') : 'None'}</p>
                            
                            <div className={styles.formGroup}>
                                <label>Summary:</label>
                                <p className={styles.summaryText}>
                                    {movie.summary}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={closeInfoModal}>
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InfoModal;