import type { Route } from "./+types/home";
import { Player } from "../ui/player";

export function meta({}: Route.MetaArgs) {
  return [
    //
    { title: "Mux 95" },
  ];
}

export default function Home() {
  return <Player />;
}
