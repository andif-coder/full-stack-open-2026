const Notification = ({className, msg}) => {
	if (msg === null) {
		return null
	}
	return (
		<div className={className}>
			{msg}
		</div>
	)
}
export default Notification

