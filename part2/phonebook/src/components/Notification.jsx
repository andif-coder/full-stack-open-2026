const Notification = ({msg}) => {
	console.log('cwj msg: ', msg.content)
	if (msg.content === null) {
		return null
	}
	return (
		<div className={msg.type}>
			{msg.content}
		</div>
	)
}
export default Notification

