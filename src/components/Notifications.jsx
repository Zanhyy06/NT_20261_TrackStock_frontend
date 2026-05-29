function Notifications({ notifications }) {
  return (
    <div className="notification-container">
      {notifications.map(n => (
        <div key={n.id} className={`notification notification-${n.type}`}>
          <span>{n.type === 'success' ? '✓' : '✕'}</span>
          {n.message}
        </div>
      ))}
    </div>
  )
}

export default Notifications
