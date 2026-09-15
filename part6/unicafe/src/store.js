import { create } from 'zustand'
const useFeedBackCounter = create((set) => ({
	good: 0,
	neutral: 0,
	bad: 0,
	actions: {
		addGood: () => set(state => ({good: state.good + 1})),
		addNeutral: () => set(state => ({neutral: state.neutral + 1})),
		addBad: () => set(state => ({bad: state.bad + 1})),
	},
}))
export const useGoodCounter = () => useFeedBackCounter(state => state.good)
export const useNeutralCounter = () => useFeedBackCounter(state => state.neutral)
export const useBadCounter = () => useFeedBackCounter(state => state.bad)
export const useCounterControls = () => useFeedBackCounter(state => state.actions)
