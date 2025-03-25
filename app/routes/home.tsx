import type { Route } from "./+types/home";
import { Player } from "../ui/player";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <h1><Player /></h1>;
}
