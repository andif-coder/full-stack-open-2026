const Notification = ({ msg }) => {
	if (msg === null) return null
	return (
		<div className={msg.type}>
			{msg.content}
		</div>
	)
}
export default Notification
