import type { Route } from "./+types/home";
import { Player } from "../ui/player";
import { Window } from "../ui/window";
import { Videos } from "~/ui/videos";

export function meta({}: Route.MetaArgs) {
  return [
    //
    { title: "Mux 95" },
  ];
}

export default function Home() {
  return (
    <>
      <Window title="Videos" windowId="videos" resizable height={400}>
        <Videos />
      </Window>
      <Window
        title="Media Player"
        windowId="media-player"
        resizable
        height={460}
        width={400}
      >
        <Player />
      </Window>
    </>
  );
}
