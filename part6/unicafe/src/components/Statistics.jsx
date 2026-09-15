import { useGoodCounter, useNeutralCounter, useBadCounter } from "../store"
const Statistics = () => {
  const good = useGoodCounter()
  const neutral = useNeutralCounter()
  const bad = useBadCounter()
  const all = good + neutral + bad
	const totalScore = good * 1 + neutral * 0 + bad * -1
  const average = all ? totalScore / all : 0
  const positive = all ? good / all * 100 : 0
  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average}</td></tr>
          <tr><td>positive</td><td>{positive} %</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
