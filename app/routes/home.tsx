import type { Route } from "./+types/home";
import { Player } from "../ui/player";
import { Window } from "../ui/window";

export function meta({}: Route.MetaArgs) {
  return [
    //
    { title: "Mux 95" },
  ];
}

export default function Home() {
  return (
    <Window title="Media Player" resizable>
      <Player />
    </Window>
  );
}
