import React from 'react';
import styles from './Modal.module.css';
import type { Movie, Series } from '../../types';


interface DeleteModalProps {
    cancelDelete: () => void;
    confirmDelete: () => Promise<void>;
    movieTitle: string;
    entityName: 'Movie' | 'Series';
}

const DeleteModal: React.FC<DeleteModalProps> = ({ cancelDelete, confirmDelete, movieTitle, entityName }) => {
    if (!movieTitle) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.formContainer}>
                    
                    <h2 className={styles.deleteTitle}>Delete {entityName}</h2>
                    
                    <p className={styles.deleteWarning}>
                        Are you sure you want to delete <strong>{movieTitle}</strong>?
                    </p>

                    <div className={styles.formActions}>
                        <button 
                            onClick={confirmDelete} 
                            className={styles.deleteConfirmButton}
                        >
                            Yes, Delete
                        </button>
                        
                        <button 
                            onClick={cancelDelete} 
                            type="button"
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;