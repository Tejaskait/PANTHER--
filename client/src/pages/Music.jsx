import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

const MusicPage = () => {
  const [songs, setSongs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    duration: '',
    file: null,
  });

  // Fetch songs and check admin status
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('/api/songs/songs');
        setSongs(response.data.songs);
      } catch (error) {
        console.error('Error fetching songs', error.response?.data || error.message);
      }
    };

    const checkAdminStatus = async () => {
      try {
        const response = await axios.get('/api/users/user-info');
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error('Error checking admin status', error.response?.data || error.message);
      }
    };

    fetchSongs();
    checkAdminStatus();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      file: e.target.files[0],
    }));
  };

  // Submit song upload form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      await axios.post('/api/songs/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowUploadForm(false); // Hide the form after successful upload
      alert('Song uploaded successfully!');
      // Re-fetch the songs list
      const response = await axios.get('/api/songs/songs');
      setSongs(response.data.songs);
    } catch (error) {
      console.error('Error uploading song:', error.response?.data || error.message);
      alert('Failed to upload song.');
    }
  };

  return (
    <div>
      <h1>Music Page</h1>

      {/* Display songs */}
      <div>
        {songs.length > 0 ? (
          songs.map((song) => (
            <div key={song._id}>
              <h2>{song.title}</h2>
              <p>Artist: {song.artist}</p>
              <p>Genre: {song.genre}</p>
              <audio controls>
                <source src={song.audioUrl} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))
        ) : (
          <p>No songs available.</p>
        )}
      </div>

      {/* Upload form button (visible only for admins) */}
      {isAdmin && !showUploadForm && (
        <button onClick={() => setShowUploadForm(true)}>Upload New Song</button>
      )}

      {/* Upload form */}
      {isAdmin && showUploadForm && (
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
          </label>
          <label>
            Artist:
            <input type="text" name="artist" value={formData.artist} onChange={handleInputChange} required />
          </label>
          <label>
            Album:
            <input type="text" name="album" value={formData.album} onChange={handleInputChange} />
          </label>
          <label>
            Genre:
            <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} />
          </label>
          <label>
            Duration (seconds):
            <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required />
          </label>
          <label>
            File:
            <input type="file" name="file" onChange={handleFileChange} required />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default MusicPage;
