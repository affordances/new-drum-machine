import DrumMachine from "../components/DrumMachine";

// import dynamic from "next/dynamic";

// const NoSSRComponent = dynamic(() => import("./App"), {
//   ssr: false,
// });

export const metadata = {
  title: "Drum Machine",
};

export default function Home() {
  return <DrumMachine />;
}
