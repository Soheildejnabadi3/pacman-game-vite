
import Game from "@/components/Game";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-game-bg py-2 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-2 text-neon-yellow animate-glow">Neon Maze Runner</h1>
      <Game />
    </div>
  );
};

export default Index;

