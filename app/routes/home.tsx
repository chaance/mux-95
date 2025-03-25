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
      <Window title="Videos" windowId="videos" resizable>
        <Videos />
      </Window>
      <Window title="Media Player" windowId="media-player" resizable>
        <Player />
      </Window>
    </>
  );
}
