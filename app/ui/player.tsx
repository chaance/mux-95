import {
  MediaProvider,
  useMediaDispatch,
  useMediaSelector,
  useMediaRef,
  useMediaFullscreenRef,
  MediaActionTypes,
} from "media-chrome/react/media-store";
import { CameraDebugPanel, useFaceLandmarks } from "~/lib/use-face-landmarks";
import React from "react";

const Video = () => {
  const mediaRef = useMediaRef();
  return (
    <video
      ref={mediaRef}
      style={{ width: "100vw" }}
      src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
      preload="auto"
      muted
      crossOrigin=""
    />
  );
};

const PlayerContainer = ({ children }: { children: React.ReactNode }) => {
  const mediaFullscreenRef = useMediaFullscreenRef();
  return <div ref={mediaFullscreenRef}>{children}</div>;
};

const PlayButton = () => {
  // Dispatch media state change requests using useMediaDispatch()
  const dispatch = useMediaDispatch();
  // Get the latest media state you care about in your component using useMediaSelector()
  const mediaPaused = useMediaSelector((state) => state.mediaPaused);
  return (
    <button
      onClick={() => {
        // Select from a set of well-defined actions for state change requests
        // using MediaActionTypes
        const type = mediaPaused
          ? MediaActionTypes.MEDIA_PLAY_REQUEST
          : MediaActionTypes.MEDIA_PAUSE_REQUEST;
        dispatch({ type });
      }}
    >
      {mediaPaused ? "Play" : "Pause"}
    </button>
  );
};

const FullscreenButton = () => {
  // Dispatch media state change requests using useMediaDispatch()
  const dispatch = useMediaDispatch();
  // Get the latest media state you care about in your component using useMediaSelector()
  const mediaIsFullscreen = useMediaSelector(
    (state) => state.mediaIsFullscreen,
  );
  return (
    <button
      onClick={() => {
        // Select from a set of well-defined actions for state change requests
        // using MediaActionTypes
        const type = mediaIsFullscreen
          ? MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST
          : MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST;
        dispatch({ type });
      }}
    >
      {mediaIsFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    </button>
  );
};

const PlaybackSpeedSlider = () => {
  const dispatch = useMediaDispatch();
  const playbackRate = useMediaSelector((state) => state.mediaPlaybackRate);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Speed:</span>
      <input
        type="range"
        min="0.25"
        max="2"
        step="0.25"
        value={playbackRate}
        onChange={(e) => {
          const newRate = parseFloat(e.target.value);
          dispatch({
            type: MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST,
            detail: newRate,
          });
        }}
        className="w-32"
      />
      <span className="text-sm">{playbackRate}x</span>
    </div>
  );
};

const VolumeSlider = () => {
  const dispatch = useMediaDispatch();
  const volume = useMediaSelector((state) => state.mediaVolume) ?? 1;
  const muted = useMediaSelector((state) => state.mediaMuted);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Volume:</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={muted ? 0 : volume}
        onChange={(e) => {
          const newVolume = parseFloat(e.target.value);
          dispatch({
            type: MediaActionTypes.MEDIA_VOLUME_REQUEST,
            detail: newVolume,
          });
          if (muted && newVolume > 0) {
            dispatch({ type: MediaActionTypes.MEDIA_UNMUTE_REQUEST });
          }
        }}
        className="w-32"
      />
      <span className="text-sm">{Math.round((muted ? 0 : volume) * 100)}%</span>
    </div>
  );
};

export const Player = () => {
  // const {
  //   videoRef,
  //   attentiveness,
  //   isWatching,
  //   cameraStatus,
  //   lastError,
  //   permissionStatus,
  //   faceDetectionStatus,
  //   lastDetectionTime,
  //   eyeStatus,
  // } = useAttentionPlayback();

  // use use-face-landmarks
  const {
    isWatching,
    cameraStatus,
    lastError,
    permissionStatus,
    faceDetectionStatus,
    lastDetectionTime,
    eyeStatus,
    attentiveness,
    videoRef,
  } = useFaceLandmarks();

  return (
    <MediaProvider>
      <PlayerContainer>
        <Video />
        <div>
          <PlayButton />
          <FullscreenButton />
          <PlaybackSpeedSlider />
          <VolumeSlider />
        </div>
        <CameraDebugPanel
          isWatching={isWatching}
          cameraStatus={cameraStatus}
          lastError={lastError}
          permissionStatus={permissionStatus}
          faceDetectionStatus={faceDetectionStatus}
          lastDetectionTime={lastDetectionTime}
          eyeStatus={eyeStatus}
          attentiveness={attentiveness}
          videoRef={videoRef}
        />
      </PlayerContainer>
    </MediaProvider>
  );
};
