import './index.scss'
export default function InfoItem({
  label,
  value
}) {
  return (
    <div className="info-item">
      <div className="label">{label}</div>
      <span>{value}</span>
    </div>
  )
}