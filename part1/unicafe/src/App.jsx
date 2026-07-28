import { useState } from 'react'

const Button = ({onClick, text}) => {
	return (
		<button onClick={onClick}> {text} </button>
	)
}

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
		<>
			<p> good  {goodNum} </p>
			<p> neutral  {neutralNum} </p>
			<p> bad  {badNum} </p>
			<p> all {totalNum} </p>
			<p> average {totalNum != 0 ? totalScore / totalNum : 0} </p>
			<p> positive {totalNum != 0 ? goodNum / totalNum * 100 : 0} % </p>
		</>
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
