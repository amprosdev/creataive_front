import './index.scss'
export default function Button({
  icon,
  onClick,
  children
}) {

  const handleClick = (e) => {
    onClick && onClick(e);
  }

  return (
    <button type="button" className="alve-btn" onClick={handleClick}>
      {icon}
      <span>
        {children}
      </span>
    </button>
  )
}