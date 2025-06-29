import './keyboard.css'

export default function Keyboard( {onkeypress} ) {

  const memoryKeys = ['MC', 'MR', 'M+', 'M-', 'MS', 'M ⌵']

  const operationKeys = [
    '%', 'CE', 'C', '⌫',
    '1/x', 'x²', '√', '÷',
    '7', '8', '9', 'x',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '±', '0', ',', "=",
  ]


  return (
    <div className="keyboard">
      <div className="memoryKeys">
        {memoryKeys.map((key, index) => (
          <button
            key = {`men-${index}`}
            className="memoryKey"
            onClick={() => onkeypress(key)}
          >
            {key}
          </button>
        ))
        }
      </div>

      <div className='operationKeys'>
        {operationKeys.map((key, index) => {
          const isFunction = ['%', 'CE', 'C', '⌫', '1/x', 'x²', '√', '÷', 'x', '-', '+'].includes(key)
          const isZeroLike = ['0', ',', '±'].includes(key)
          const isEqualKey = ['='].includes(key)

          let className = 'operationKey'
          if (isFunction) className += ' functionKey'
          else if (isZeroLike) className += ' zeroKey'
          else if (isEqualKey) className += ' equalKey'

          return (
            <button
              key={`op-${index}`}
              className={className}
              onClick={() => onkeypress(key)}
            >
              {key}
            </button>
          )
        })}
      </div>
    </div>
    )
}