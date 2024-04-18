import App from "./App";

// import dynamic from "next/dynamic";

// const NoSSRComponent = dynamic(() => import("./App"), {
//   ssr: false,
// });

export default function Home() {
  return <App />;
}
