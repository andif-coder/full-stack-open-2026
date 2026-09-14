import { Alert } from "@mui/material"
const Notification = ({ msg }) => {
  if (msg === null) return null
  return (
		<Alert style={{marginTop: 10, marginBottom: 10}} severity={msg.type}>
			{msg.content}
		</Alert>
  )
}
export default Notification
