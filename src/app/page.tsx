import {  HydrateClient } from "~/trpc/server";
import AuthPage from "./_components/Auth/Auth";


export default async function Home() {

  return (
    <HydrateClient>
      <AuthPage/>
    </HydrateClient>
  );
}
