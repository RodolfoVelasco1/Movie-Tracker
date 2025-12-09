import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import styles from './Modal.module.css'
import type { Genre } from '../../types';
import * as yup from 'yup';

interface ModalProps {
    handleCloseModal: () => void;
    genres: Genre[];
    formData: {
        title: string;
        summary: string;
        duration: string;
        imageUrl: string;
        episodes?: string; 
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        title: string;
        summary: string;
        duration: string;
        imageUrl: string;
        episodes?: string;
    }>>;
    selectedGenres: number[];
    setSelectedGenres: React.Dispatch<React.SetStateAction<number[]>>;
    handleGenreChange: (e: ChangeEvent<HTMLInputElement>) => void;
    isEditing: boolean;
    entityName: 'Movie' | 'Series';
    cancelEdit: () => void;
    handleSubmit: (e: FormEvent) => Promise<void>;
}
const Modal: React.FC<ModalProps> = ({ 
    handleCloseModal, 
    genres, 
    formData, 
    setFormData,
    selectedGenres,
    setSelectedGenres,
    handleGenreChange,
    isEditing, 
    entityName,
    cancelEdit,
    handleSubmit 
}) => {


  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [imageInputType, setImageInputType] = useState('url');
  const [isUploading, setIsUploading] = useState(false);

  const handleValidationAndSubmit = async (e: FormEvent) => {
    e.preventDefault(); 

    const schema = yup.object().shape({
      title: yup.string().required("Title is required"),
      summary: yup.string().required("Summary is required"),
      duration: yup.number()
        .transform((value) => (isNaN(value) ? undefined : value)) 
        .required("Duration is required and must be a number")
        .positive("Duration must be positive")
        .integer(),
      imageUrl: yup.string().required("Image is required"),
      genres: yup.array().min(1, "Select at least one genre"),

      episodes: entityName === 'Series' 
          ? yup.string().required("Episodes are required for Series") 
          : yup.string().notRequired()
    });

    const dataToCheck = {
      ...formData,
      genres: selectedGenres
    };

    try {
      await schema.validate(dataToCheck, { abortEarly: false });
      
      handleSubmit(e);

    } catch (error) {
      if (error instanceof yup.ValidationError) {
        alert(error.errors[0]); 
      }
    }
  };


  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);

      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', UPLOAD_PRESET);

      try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
              method: 'POST',
              body: data
          });

          if (!res.ok) throw new Error('Error uploading to Cloudinary');

          const fileData = await res.json();
          
          setFormData({ ...formData, imageUrl: fileData.secure_url });

      } catch (error) {
          console.error("Error uploading image:", error);
          alert("Error uploading image, please try again.");
      } finally {
          setIsUploading(false);
      }
  };
  


  return (
          <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
              <div className={styles.formContainer}>
            <h2>{isEditing ? `Edit this ${entityName}` : `Add a new ${entityName}`}</h2>
            <form onSubmit={handleValidationAndSubmit}>
              <div className={styles.formGroup}>
                <label>Title:</label> 
                <input 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Summary:</label>
                <textarea
                  value={formData.summary} 
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Duration (in minutes):</label> 
                <input 
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })} 
                />

                {entityName === 'Series' && (
                    <div className={styles.formGroup}>
                        <label>Episodes:</label> 
                        <input 
                            type="number"
                            value={formData.episodes || ''} 
                            onChange={(e) => setFormData({ ...formData, episodes: e.target.value })} 
                        />
                    </div>
                )}

              <div className={styles.formGroup}>
                <label>Image:</label>
                
                <div className={styles.imageTypeSelector}>
                    <label className={styles.radioLabel}>
                        <input 
                            type="radio" 
                            name="imgType" 
                            checked={imageInputType === 'url'} 
                            onChange={() => setImageInputType('url')}
                        /> Link URL
                    </label>
                    <label className={styles.radioLabel}>
                        <input 
                            type="radio" 
                            name="imgType" 
                            checked={imageInputType === 'file'} 
                            onChange={() => setImageInputType('file')}
                        /> Upload File
                    </label>
                </div>

                {imageInputType === 'url' ? (
                    <input 
                      type="text"
                      placeholder="Paste image URL here..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
                    />
                ) : (
                    <div>
                        <input 
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading} 
                        />
                        {isUploading && (
                            <p className={styles.uploadingText}>
                                Uploading Image...
                            </p>
                        )}
                    </div>
                )}

                {formData.imageUrl && !isUploading && (
                    <img src={formData.imageUrl} alt="Preview" className={styles.imagePreview} />
                )}
              </div>
              </div>

              <div className={styles.formGroup}>
                <label>Genres:</label>
                <div className={styles.genreList}>
                    {genres.map(genre => (
                        <div key={genre.id} className={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                id={`genre-${genre.id}`}
                                name="genres"
                                value={genre.id}
                                checked={selectedGenres.includes(genre.id)}
                                onChange={handleGenreChange}
                            />
                            <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
                        </div>
                    ))}
                </div>
            </div>


              <div className={styles.formActions}>
                <button type="submit"> 
                  {isEditing ? `Update ${entityName}` : `Add ${entityName}`} 
                </button>
                <button type="button" onClick={cancelEdit}> 
                    Cancel
                  </button>
              </div>
            </form>
          </div>
            </div>
          </div>
        )}

      

export default Modal