import {
  MediaProvider,
  useMediaDispatch,
  useMediaSelector,
  useMediaRef,
  useMediaFullscreenRef,
  MediaActionTypes,
} from "media-chrome/react/media-store";
import * as React from "react";
import { useDisplayCoverage } from "../lib/use-display-coverage";
import { useFaceLandmarks, CameraDebugPanel } from "../lib/use-face-landmarks";
import { useRandomVolume } from "../lib/use-random-volume";

const Video = () => {
  // "Wire up" the <video/> element to the MediaStore using useMediaRef()
  const mediaRef = useMediaRef();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Set up random volume control
  useRandomVolume(videoRef);

  return (
    <video
      ref={(el) => {
        videoRef.current = el;
        mediaRef(el);
      }}
      style={{ width: "100%" }}
      src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
      preload="auto"
      crossOrigin=""
    />
  );
};

const PlayerContainer = ({ children }) => {
  // "Wire up" the element you want the MediaStore to target for fullscreen using useMediaFullscreenRef()
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
      <button
        onClick={() => {
          const randomVolume = Math.random();
          dispatch({
            type: MediaActionTypes.MEDIA_VOLUME_REQUEST,
            detail: randomVolume,
          });
          if (muted) {
            dispatch({ type: MediaActionTypes.MEDIA_UNMUTE_REQUEST });
          }
        }}
        className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transition-colors"
      >
        Random
      </button>
    </div>
  );
};

const PlaybackRateController = ({
  displayCoverage,
}: {
  displayCoverage: number;
}) => {
  const dispatch = useMediaDispatch();
  const currentPlaybackRate = useMediaSelector(
    (state) => state.mediaPlaybackRate,
  );

  React.useEffect(() => {
    // Debounce the playback rate updates
    const timeoutId = setTimeout(() => {
      // Clamp the playback rate between 0.5x and 2x
      const playbackRate = Math.min(Math.max(displayCoverage, 0.5), 2);

      dispatch({
        type: MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST,
        detail: playbackRate,
      });
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [displayCoverage, dispatch, currentPlaybackRate]);

  return null;
};

export const Player = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const displayCoverage = useDisplayCoverage(containerRef) / 100;
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
        <div ref={containerRef}>
          <Video />
        </div>
        <div>
          <PlayButton />
          <FullscreenButton />
          <VolumeSlider />
        </div>
        <div>
          <CameraDebugPanel
            isWatching={isWatching}
            cameraStatus={cameraStatus}
            lastError={lastError}
            permissionStatus={permissionStatus}
            faceDetectionStatus={faceDetectionStatus}
            lastDetectionTime={lastDetectionTime}
            eyeStatus={eyeStatus}
            attentiveness={attentiveness}
            videoRef={videoRef as React.RefObject<HTMLVideoElement>}
          />
        </div>
        <PlaybackRateController displayCoverage={displayCoverage} />
      </PlayerContainer>
    </MediaProvider>
  );
};
