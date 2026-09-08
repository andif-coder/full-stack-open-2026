const Notification = ({ msg }) => {
	console.log('cwj1 :', msg)
	if (msg === null) return null
	console.log('cwj2 content:', msg.content)
	return (
		<div className={msg.type}>
			{msg.content}
		</div>
	)
}
export default Notification
