
import React from 'react';
import { useAudio } from '../../audio/AudioProvider';
import './MusicToggle.css';

function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path
        d="M16 8c1.5 1 1.5 7 0 8M18.5 5.5c3 2 3 11 0 13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path
        d="M16 9l5 6M21 9l-5 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MusicToggle() {
  const { muted, volume, ambientOn, toggleMute, toggleAmbient, setVolume } = useAudio();

  return (
    <div className={`audio ${muted ? 'is-muted' : ''}`} role="group" aria-label="Audio controls">
      <button
        className={`audio__btn audio__btn--ambient ${ambientOn ? 'is-on' : ''}`}
        onClick={toggleAmbient}
        aria-pressed={ambientOn}
        aria-label={ambientOn ? 'Pause ambient music' : 'Play ambient music'}
        data-cursor="hover"
      >
        <span className="audio__bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="audio__label">{ambientOn ? 'Ambient' : 'Music'}</span>
      </button>

      <label className="audio__vol" aria-label="Master volume">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          data-cursor="hover"
        />
      </label>

      <button
        className={`audio__btn audio__btn--mute ${muted ? 'is-muted' : ''}`}
        onClick={toggleMute}
        aria-pressed={muted}
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        data-cursor="hover"
      >
        {muted ? <MuteIcon /> : <SoundIcon />}
      </button>
    </div>
  );
}
