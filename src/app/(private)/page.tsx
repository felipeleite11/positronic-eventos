import Timeline from "@/components/Timeline";
import TournamentList from "@/components/TournamentList";

export default function Home() {
  return (
    <main className="pl-10 pt-8 justify-self-center grid grid-cols-[3fr_2.5fr] h-[93vh]">
      <TournamentList />

      {/* espaço publicitário para arenas e empresas */}

      {/* divulgar torneios */}

      {/* exibir classificados de raquetes e acessórios, permitir anúncios dos usuários */}

      <Timeline />
    </main>
  )
}
