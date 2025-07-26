import type { UserStatistics } from "../pages/ProfilePage"

interface Props {
    stats: UserStatistics
}

function UserStats({stats}: Props) {
  return (
    <div className="flex flex-col items-baseline gap-y-8 w-[400px]">
        <div className="flex items-baseline justify-around w-full">
            <div className="flex flex-col justify-center items-center">
                <div className="text-xl font-light">Games Played</div>
                <div className="text-3xl font-semibold">{stats.games_played}</div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="text-xl font-light">Wins</div>
                <div className="text-3xl font-semibold">{stats.wins}</div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="text-xl font-light">Losses</div>
                <div className="text-3xl font-semibold">{stats.losses}</div>
            </div>
        </div>
        <div className="flex items-baseline justify-around w-full">
            <div className="flex flex-col justify-center items-center">
                <div className="text-xl font-light">Win Percentage</div>
                <div className="text-3xl font-semibold">{stats.win_percentage.toFixed(1)}%</div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="text-xl font-light">Profit</div>
                {stats.profit >= 0 ? (
                    <div className="text-3xl font-semibold">${stats.profit.toFixed(2)}</div>
                ) : (
                    <div className="text-3xl font-semibold">-${Math.abs(stats.profit).toFixed(2)}</div>
                )} 
            </div>
        </div>
    </div>
  )
}

export default UserStats