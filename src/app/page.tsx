import dynamic from "next/dynamic";

const NoSSRComponent = dynamic(() => import("../components/DrumMachine"), {
  ssr: false,
});

export const metadata = {
  title: "reDrummer",
};

export default function Home() {
  return <NoSSRComponent />;
}
