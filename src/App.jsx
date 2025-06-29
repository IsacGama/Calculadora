import { useState, useEffect } from 'react';
import Display from './components/display/display.jsx';
import Keyboard from './components/keyboard/keyboard.jsx';
import HistoryPanel from './components/history/historypanel.jsx';
import MemoryPanel from './components/memory/memorypanel.jsx';

import './App.css';
import historyIcon from './assets/historico.png';

function App() {
  const [currentInput, setCurrentInput] = useState('0');
  const [expression, setExpression] = useState('');
  const [operator, setOperator] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [overwrite, setOverwrite] = useState(false);
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showMemory, setShowMemory] = useState(false);

  const formatNumber = (numStr) => {
    if (numStr === 'Erro') return numStr;
    const num = parseFloat(numStr);
    if (isNaN(num)) return numStr;
    return Number.isInteger(num) ? num.toString() : num.toFixed(11).replace(/\.?0+$/, '');
  };

  const handleClick = (key) => {
    if (!isNaN(key)) {
      if (currentInput === '0' || overwrite) {
        setCurrentInput(key);
        setOverwrite(false);
      } else {
        setCurrentInput(prev => prev + key);
      }
      return;
    }

    switch (key) {
      case ',':
        if (!currentInput.includes('.')) {
          setCurrentInput(prev => prev + '.');
        }
        break;

      case 'C':
        setCurrentInput('0');
        setExpression('');
        setPreviousValue(null);
        setOperator(null);
        break;

      case 'CE':
        setCurrentInput('0');
        break;

      case '⌫':
        setCurrentInput(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        break;

      case '±':
        setCurrentInput(prev => String(parseFloat(prev) * -1));
        break;

      case '%': {
        const num = parseFloat(currentInput);
        const result = num / 100;
        setCurrentInput(String(result));
        setExpression(`${formatNumber(num)} %`);
        setHistory(prev => [...prev, { expression: `${formatNumber(num)} %`, result: formatNumber(String(result)) }]);
        break;
      }

      case 'x²': {
        const num = parseFloat(currentInput);
        const result = Math.pow(num, 2);
        setCurrentInput(formatNumber(String(result)));
        setExpression(`${formatNumber(num)}²`);
        setHistory(prev => [...prev, { expression: `${formatNumber(num)}²`, result: formatNumber(String(result)) }]);
        break;
      }

      case '√': {
        const num = parseFloat(currentInput);
        const result = Math.sqrt(num);
        setCurrentInput(formatNumber(String(result)));
        setExpression(`√(${formatNumber(num)})`);
        setHistory(prev => [...prev, { expression: `√(${formatNumber(num)})`, result: formatNumber(String(result)) }]);
        break;
      }

      case '1/x': {
        const num = parseFloat(currentInput);
        if (num === 0) {
          setCurrentInput('Erro');
          setExpression(`1 / ${formatNumber(num)}`);
          setHistory(prev => [...prev, { expression: `1 / ${formatNumber(num)}`, result: 'Erro' }]);
        } else {
          const result = 1 / num;
          setCurrentInput(formatNumber(String(result)));
          setExpression(`1 / ${formatNumber(num)}`);
          setHistory(prev => [...prev, { expression: `1 / ${formatNumber(num)}`, result: formatNumber(String(result)) }]);
        }
        break;
      }

      case '=':
        if (operator && previousValue != null) {
          const result = calculate(previousValue, operator, currentInput);
          const fullExpr = `${formatNumber(previousValue)} ${operator} ${formatNumber(currentInput)}`;
          const formattedResult = formatNumber(String(result));

          setCurrentInput(formattedResult);
          setExpression(fullExpr);
          setHistory(prev => [...prev, { expression: fullExpr, result: formattedResult }]);
          setPreviousValue(null);
          setOperator(null);
          setOverwrite(true);
        }
        break;

      case '+':
      case '-':
      case 'x':
      case '÷':
        if (operator && !overwrite) {
          const result = calculate(previousValue, operator, currentInput);
          setPreviousValue(result);
          setCurrentInput('0');
          setExpression(`${formatNumber(String(result))} ${key}`);
        } else {
          setPreviousValue(parseFloat(currentInput));
          setExpression(`${formatNumber(currentInput)} ${key}`);
        }
        setOperator(key);
        setOverwrite(true);
        break;

      case 'MC':
        setMemory([]);
        break;

      case 'MR':
        if (memory.length > 0) {
          const last = memory[memory.length - 1];
          setCurrentInput(last);
          setOverwrite(true);
        }
        break;

      case 'M+': {
        const value = parseFloat(currentInput);
        if (!isNaN(value)) {
          setMemory(prev => {
            if (prev.length === 0) return [formatNumber(String(value))];
            const last = parseFloat(prev[prev.length - 1]);
            const updated = formatNumber(String(last + value));
            return [...prev.slice(0, -1), updated];
          });
        }
        break;
      }

      case 'M-': {
        const value = parseFloat(currentInput);
        if (!isNaN(value)) {
          setMemory(prev => {
            if (prev.length === 0) return [formatNumber(String(-value))];
            const last = parseFloat(prev[prev.length - 1]);
            const updated = formatNumber(String(last - value));
            return [...prev.slice(0, -1), updated];
          });
        }
        break;
      }

      case 'MS': {
        const value = parseFloat(currentInput);
        if (!isNaN(value)) {
          setMemory(prev => [...prev, formatNumber(currentInput)]);
        }
        break;
      }

      case 'M ⌵':
        setShowMemory(!showMemory);
        break;

      default:
        break;
    }
  };

  const calculate = (a, op, b) => {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case 'x': return a * b;
      case '÷': return b === 0 ? 'Erro' : a / b;
      default: return b;
    }
  };

  const handleSelectFromHistory = (result) => {
    setCurrentInput(result);
    setExpression('');
    setOverwrite(true);
    setShowHistory(false);
  };

  const handleClearHistory = (index) => {
    if (typeof index === 'number') {
      setHistory(prev => prev.filter((_, i) => i !== index));
    } else {
      setHistory([]);
    }
  };

  const handleSelectFromMemory = (value) => {
    setCurrentInput(value);
    setExpression('');
    setOverwrite(true);
    setShowMemory(false);
  };

  const handleClearMemory = (index) => {
    if (typeof index === 'number') {
      setMemory(prev => prev.filter((_, i) => i !== index));
    } else {
      setMemory([]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        'Enter': '=',
        'Backspace': '⌫',
        'Delete': 'C',
        ',': ',',
        '.': ',',
        '/': '÷',
        '*': 'x',
        '-': '-',
        '+': '+',
        '%': '%',
        '²': 'x²'
      };

      let key = e.key;

      if (!isNaN(key)) {
        handleClick(key);
      } else if (keyMap[key]) {
        handleClick(keyMap[key]);
      } else if (key === 'm' || key === 'M') {
        handleClick('M ⌵'); // tecla 'm' abre a memória
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  return (
    <div className="calculadora">
      <div className="history-button" onClick={() => setShowHistory(!showHistory)}>
        <img src={historyIcon} alt="Histórico" />
      </div>

      <Display result={formatNumber(currentInput)} expression={expression} />
      <Keyboard onkeypress={handleClick} />

      <div className={`history-overlay ${showHistory ? 'show' : ''}`}>
        <HistoryPanel
          history={history}
          onClearHistory={handleClearHistory}
          onSelect={handleSelectFromHistory}
          onClose={() => setShowHistory(false)}
        />
      </div>

      <div className={`memory-overlay ${showMemory ? 'show' : ''}`}>
        <MemoryPanel
          memory={memory}
          onSelect={handleSelectFromMemory}
          onClearMemory={handleClearMemory}
        />
      </div>
    </div>
  );
}

export default App;