import './historypanel.css'
import lixeira from '../../assets/lixeira.png'

export default function HistoryPanel({ history, onSelect, onClearHistory }) {
  return (
    <div className="historico">
      <div className="history-header">
        <h3>Histórico</h3>
        <button 
          className="clear-all-button" 
          onClick={(e) => {
            e.stopPropagation();
            onClearHistory();
          }}
        >
          Limpar tudo
        </button>
      </div>

      {history.length === 0 ? (
        <div className="no-history">Ainda Não Há Histórico</div>
      ) : (
        <div className="history-items">
          {history.map((item, index) => (
            <div
              className="history-item"
              key={`history-${index}`}
              onClick={() => onSelect(item.result)}
            >
              <div className="history-expression">{item.expression}</div>
              <div className="history-result">= {item.result}</div>

              <button 
                className='cleanHistory' 
                onClick={(e) => {
                  e.stopPropagation();
                  onClearHistory(index);
                }}
              >
                <img src={lixeira} alt="Remover item" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}