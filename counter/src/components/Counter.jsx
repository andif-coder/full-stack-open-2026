import useCounterStore from "../store/useCounterStore"
const Counter = () => {
	const value = useCounterStore((state) => state.value)
	const increase = useCounterStore((state) => state.increase)
	const decrease = useCounterStore((state) => state.decrease)
	return (
		<div>
			<p> Counter: {value} </p>
			<button onClick={increase}>increase</button>
			<button onClick={decrease}>decrease</button>
		</div>
	)
}
export default Counter
