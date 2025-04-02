"use client";

import * as React from "react";
import {
  default as MuxUploader,
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderRetry,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { useLoaderData, useNavigate, useRouteLoaderData } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "./button";
import { useWindowsContext } from "./use-window-context";

interface Video {
  id: string;
  name: string;
  playbackId?: string;
  status: "uploading" | "processing" | "ready" | "error";
  progress?: number;
}

interface VideosProps {
  onVideoSelect?: (playbackUrl: string) => void;
}

const MUX_UPLOADER_ID = "my-videos-uploader";

function VideosImpl({ onVideoSelect }: VideosProps) {
  const { mux } = useRouteLoaderData<{
    mux: { id: string; url: string; videos: any[] };
  }>("root")!;
  const { videos } = mux;
  const navigate = useNavigate();
  const { openWindow } = useWindowsContext();

  return (
    <div>
      <MuxUploader
        id={MUX_UPLOADER_ID}
        endpoint={mux.url}
        style={{ display: "none" }}
        // onUploadStart={}
        onSuccess={() => {
          // force refresh loader data to update video list
          navigate(".", { replace: true });
        }}
      />

      {/* Toolbar */}
      <div>
        <MuxUploaderFileSelect muxUploader={MUX_UPLOADER_ID}>
          <Button type="button">
            <UploadIcon />
            Upload a video
          </Button>
        </MuxUploaderFileSelect>
      </div>

      {/* progress */}
      <MuxUploaderProgress type="percentage" muxUploader={MUX_UPLOADER_ID} />

      {/* File explorer */}
      <MuxUploaderDrop
        muxUploader={MUX_UPLOADER_ID}
        overlay
        overlayText="Drop video files here"
      >
        {videos.length === 0 ? (
          <div>
            <p>Drag and drop video files here</p>
          </div>
        ) : (
          <div>
            {videos.map((video) => {
              if (video.status === "uploading") {
                return (
                  <div
                    key={video.id}
                    style={{
                      width: `${video.progress}%`,
                      height: "4px",
                      backgroundColor: "blue",
                    }}
                  />
                );
              }
              if (video.status === "error") {
                return (
                  <p key={video.id} style={{ color: "red" }}>
                    Error uploading {video.name}
                  </p>
                );
              }

              return (
                <button
                  type="button"
                  key={video.id}
                  disabled={video.status !== "ready"}
                  style={{ display: "flex", gap: "0.5rem" }}
                  onClick={() => {
                    if (video.status === "ready") {
                      openWindow("media-player", { videoId: video.id });
                    }
                  }}
                >
                  {video.status === "processing" && <span>Processing…</span>}
                  <span>
                    {video.id?.length > 15
                      ? video.id.substring(0, 12) + "..."
                      : video.id}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </MuxUploaderDrop>

      {/* Status bar */}
      <div>{videos.length} item(s)</div>
    </div>
  );
}

export function Videos(props: VideosProps) {
  return (
    <ErrorBoundary
      fallback={null}
      onError={(error) => {
        console.error(error);
      }}
    >
      <VideosImpl {...props} />
    </ErrorBoundary>
  );
}

function UploadIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function FileIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <path d="M17 2L7 12h4v8" />
    </svg>
  );
}
