export interface IMatch {
  id?: number,
  homeTeam: number
  awayTeam: number
  homeTeamGoals: number
  awayTeamGoals: number
  inProgress: boolean
  teamHome?: {
    teamName: string
  }
  teamAway?: {
    teamName: string
  }
}
