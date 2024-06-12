import dynamic from "next/dynamic";

const NoSSRComponent = dynamic(() => import("../components/DrumMachine"), {
  ssr: false,
});

export const metadata = {
  title: "ReDrummer",
};

export default function Home() {
  return <NoSSRComponent />;
}
