import './memorypanel.css';
import lixeira from '../../assets/lixeira.png';

export default function MemoryPanel({ memory, onSelect, onClearMemory }) {
  return (
    <div className="memoria">
      <div className="memory-header">
        <h3>Memória</h3>
        <button
          className="clear-all-button"
          onClick={(e) => {
            e.stopPropagation();
            onClearMemory();
          }}
        >
          Limpar tudo
        </button>
      </div>

      {memory.length === 0 ? (
        <div className="no-memory">Ainda Não Há Itens na Memória</div>
      ) : (
        <div className="memory-items">
          {memory.slice().reverse().map((item, index) => (
            <div
              className="memory-item"
              key={`memory-${index}`}
              onClick={() => onSelect(item)}
            >
              <div className="memory-value">{item}</div>
              <button
                className="cleanMemory"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearMemory(memory.length - 1 - index); // Corrige o índice real
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