export default function MeetingBoxAdmin({
  meetings,
  onConfirm,
  onDeny,
  onEdit,
  onDelete,
}) {
  return (
    <div>
      <h2>Meetings</h2>
      <ul>
        {meetings.map((meeting) => (
          <li key={meeting._id} data-meeting-id={meeting._id}>
            <h3>{meeting.title}</h3>
            <p>Date: {new Date(meeting.date).toDateString()}</p>
            <p>Time: {meeting.time}</p>
            <p>Status: {meeting.status}</p>
            <div className="grid">
              <button onClick={() => onConfirm(meeting._id)}>Confirm</button>
              <button onClick={() => onDeny(meeting._id)} className="secondary">
                Deny
              </button>
              <button onClick={() => onEdit(meeting._id)}>Edit</button>
              <button
                onClick={() => onDelete(meeting._id)}
                className="secondary"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
