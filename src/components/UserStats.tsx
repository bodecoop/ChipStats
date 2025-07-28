import type { UserStatistics } from "../pages/ProfilePage"

interface Props {
    stats: UserStatistics
}

function UserStats({ stats }: Props) {
  return (
    <div className="flex flex-col items-baseline gap-y-8 w-full max-w-[400px] px-4 text-center">
      <div className="flex items-baseline justify-around w-full gap-x-4">
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-lg md:text-xl font-light">Games Played</div>
          <div className="text-2xl md:text-3xl font-semibold">{stats.games_played}</div>
        </div>
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-lg md:text-xl font-light">Wins</div>
          <div className="text-2xl md:text-3xl font-semibold">{stats.wins}</div>
        </div>
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-lg md:text-xl font-light">Losses</div>
          <div className="text-2xl md:text-3xl font-semibold">{stats.losses}</div>
        </div>
      </div>
      <div className="flex items-baseline justify-around w-full gap-x-4">
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-lg md:text-xl font-light">Win Percentage</div>
          <div className="text-2xl md:text-3xl font-semibold">
            {stats.win_percentage.toFixed(1)}%
          </div>
        </div>
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-lg md:text-xl font-light">Profit</div>
          <div className="text-2xl md:text-3xl font-semibold">
            {stats.profit >= 0
              ? `$${stats.profit.toFixed(2)}`
              : `-$${Math.abs(stats.profit).toFixed(2)}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserStats