import React, { useEffect, useState, useRef } from 'react';
import axios from '../utils/axios';
import './MusicPage.css';

const MusicPage = () => {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true); // AutoPlay enabled by default
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('/api/songs/songs');
        setSongs(response.data.songs);

        // Check for a song ID in the URL and set it as the current song
        const urlParams = new URLSearchParams(window.location.search);
        const songId = urlParams.get('song');
        if (songId) {
          const songIndex = response.data.songs.findIndex((s) => s._id === songId);
          if (songIndex >= 0) {
            setCurrentSongIndex(songIndex);
          }
        }
      } catch (error) {
        console.error('Error fetching songs', error.response?.data || error.message);
      }
    };

    fetchSongs();
  }, []);

  // Play or pause the current song
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Play the next song
  const playNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);

    // Temporarily show the "Pause" button during transition
    setTimeout(() => {
      if (audioRef.current) audioRef.current.play();
    }, 100);
  };

  // Play the previous song
  const playPrevious = () => {
    const previousIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(previousIndex);
    setIsPlaying(true);

    // Temporarily show the "Pause" button during transition
    setTimeout(() => {
      if (audioRef.current) audioRef.current.play();
    }, 100);
  };

  // Adjust volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  // Toggle AutoPlay
  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  // Handle song end
  const handleSongEnd = () => {
    if (autoPlay) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  };

  const shareLink = () => {
    const baseUrl = window.location.origin; // Get the current domain
    const songId = songs[currentSongIndex]._id;
    const link = `${baseUrl}/?song=${songId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Song link copied to clipboard!');
    });
  };

  return (
    <div className="music-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>My Playlist</h2>
        <ul>
          {songs.map((song, index) => (
            <li
              key={song._id}
              className={index === currentSongIndex ? 'active' : ''}
              onClick={() => {
                setCurrentSongIndex(index);
                setIsPlaying(true);
                setTimeout(() => {
                  if (audioRef.current) audioRef.current.play();
                }, 100);
              }}
            >
              {song.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {songs.length > 0 && (
          <div className="player">
            <h1>{songs[currentSongIndex]?.title}</h1>
            <h3>{songs[currentSongIndex]?.artist}</h3>
            <audio
              ref={audioRef}
              src={songs[currentSongIndex]?.audioUrl}
              onEnded={handleSongEnd}
            />
            <div className="controls">
              <button onClick={playPrevious}>⏮️</button>
              <button onClick={togglePlayPause}>
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button onClick={playNext}>⏭️</button>
            </div>
            <div className="volume-control">
              <label>
                Volume:
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </label>
            </div>
            <div className="auto-play">
              <label>
                AutoPlay Next:
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={toggleAutoPlay}
                />
              </label>
            </div>
            <div className="share-link">
              <button onClick={shareLink}>Share Link</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MusicPage;
