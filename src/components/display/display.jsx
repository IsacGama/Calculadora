import './display.css'

export default function Display({ result, expression }) {
  return (
    <div className="display">
      <div className="expressao">{expression}</div>
      <div className="resultado">{result || 0}</div>
    </div>
  )
}