import { create } from 'zustand'
const useCounterStore = create((set) => ({
	value: 0,
	increase: () => set((state) => ({value: state.value + 1})),
	decrease: () => set((state) => ({value: state.value - 1})),
	zero: () => set({value: 0})
}))
export default useCounterStore
