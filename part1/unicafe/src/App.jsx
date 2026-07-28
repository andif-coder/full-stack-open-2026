import { useState } from 'react'

const Button = ({onClick, text}) => {
	return (
		<button onClick={onClick}> {text} </button>
	)
}
const StatisticLine = ({text, value}) => <p> {text} {value} </p>
const Statistics = (props) => {
	const goodNum = props.good
	const neutralNum = props.neutral
	const badNum = props.bad
	const totalScore = goodNum * 1 + neutralNum * 0 + badNum * -1
	const totalNum = goodNum + neutralNum + badNum
	if (totalNum == 0) {
		return (
			<p> No feedback given </p>
		)
	}
	return (
		<div>
			<StatisticLine text='good' value={goodNum} />
			<StatisticLine text='neutral' value={neutralNum} />
			<StatisticLine text='bad' value={badNum} />
			<StatisticLine text='all' value={totalNum} />
			<StatisticLine text='average' value={totalScore / totalNum} />
			<StatisticLine text='positive' value={goodNum / totalNum * 100 + '%'} />
		</div>
	)
}

const App = () => {
	const [feedback, setFeedback] = useState({
		good: 0,
		neutral: 0,
		bad: 0,
	})
	const addGood = () => {
		setFeedback(prev => ({
			...prev,
			good: prev.good + 1
		}))
	}
	const addNeutral = () => {
		setFeedback(prev => ({
			...prev,
			neutral: prev.neutral + 1
		}))
	}
	const addBad = () => {
		setFeedback(prev => ({
			...prev,
			bad: prev.bad + 1
		}))
	}
	return (
		<div>
			<h1>give feedback</h1>
			<Button onClick={addGood} text='good' />
			<Button onClick={addNeutral} text='neutral' />
			<Button onClick={addBad} text='bad' />
			<h1>statistics</h1>
			<Statistics {...feedback}/>
		</div>
	)
}

export default App
