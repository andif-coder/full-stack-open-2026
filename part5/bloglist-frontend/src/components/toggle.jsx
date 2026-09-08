import { useImperativeHandle, useState } from "react"

const Togglable = (props) => {
	const [visible, setVisible] = useState(false)
	const toggleVisibility = () => {
		setVisible(!visible)
	}
	useImperativeHandle(props.ref, () => {
		return { toggleVisibility }
	})
	const hidden = { display: visible ? 'none' : '' }
	const show = { display: !visible ? 'none' : '' }
	return (
		<div>
			<div style={hidden}>
				<button onClick={toggleVisibility}>{props.buttonLabel}</button>
			</div>
			<div style={show}>
				{props.children}
				<button onClick={toggleVisibility}>cancel</button>
			</div>
		</div>
	)
}

export default Togglable
