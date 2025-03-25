import * as React from "react";
import {
  useMediaDispatch,
  MediaActionTypes,
} from "media-chrome/react/media-store";

interface UseRandomVolumeOptions {
  /** The interval in milliseconds between volume changes. Defaults to 1000ms */
  interval?: number;
  /** Initial volume value between 0 and 1. Defaults to 1 */
  initialVolume?: number;
  /** Whether to unmute the video when starting. Defaults to true */
  unmute?: boolean;
}

/**
 * A hook that randomly changes the volume of a video element at a specified interval
 * @param videoRef - React ref containing the video element
 * @param options - Configuration options for the random volume control
 */
export function useRandomVolume(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  sliderRef: React.RefObject<HTMLInputElement | null>,
  {
    interval = 1000,
    initialVolume = 1,
    unmute = true,
  }: UseRandomVolumeOptions = {},
) {
  const dispatch = useMediaDispatch();
  const intervalRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isPointerDownOnSlider = false;
    const abortController = new AbortController();
    sliderRef.current?.addEventListener(
      "pointerdown",
      () => {
        isPointerDownOnSlider = true;
      },
      { signal: abortController.signal },
    );
    window.addEventListener(
      "pointerup",
      () => {
        isPointerDownOnSlider = false;
      },
      { signal: abortController.signal },
    );
    window.addEventListener(
      "pointercancel",
      () => {
        isPointerDownOnSlider = false;
      },
      { signal: abortController.signal },
    );

    // Initial setup
    console.log("Initializing random volume control");
    video.volume = initialVolume;
    if (unmute) {
      video.muted = false;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = window.setInterval(() => {
      if (isPointerDownOnSlider || video.paused) {
        return;
      }

      const randomVolume = Math.min(Math.max(Math.random(), 0), 1);
      console.log("Setting new volume:", randomVolume);
      video.volume = randomVolume;
      dispatch({
        type: MediaActionTypes.MEDIA_VOLUME_REQUEST,
        detail: randomVolume,
      });
    }, interval);

    // Cleanup function
    return () => {
      console.log("Cleaning up random volume control");
      abortController.abort();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [unmute]); // Empty dependency array since we're using refs
}
