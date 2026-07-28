import { useState } from 'react'

const Button = ({onClick, text}) => {
	return (
		<button onClick={onClick}> {text} </button>
	)
}

const App = () => {
	const [feedback, setFeedback] = useState({
		good: 0,
		neutral: 0,
		bad: 0,
	})
	const addGood = () => {
		setFeedback({
			...feedback,
			good: feedback.good + 1
		})
	}
	const addNeutral = () => {
		setFeedback({
			...feedback,
			neutral: feedback.neutral + 1
		})
	}
	const addBad = () => {
		setFeedback({
			...feedback,
			bad: feedback.bad + 1
		})
	}
	return (
		<div>
			<h1>give feedback</h1>
			<Button onClick={addGood} text='good' />
			<Button onClick={addNeutral} text='neutral' />
			<Button onClick={addBad} text='bad' />
			<h1>statistics</h1>
			<p> good  {feedback.good} </p>
			<p> neutral  {feedback.neutral} </p>
			<p> bad  {feedback.bad} </p>
		</div>
	)
}

export default App
