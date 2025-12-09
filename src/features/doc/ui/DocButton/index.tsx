// src\features\doc\ui\DocButton\index.tsx
import './DocButton.css'

// Types
import type { DocButtonProps } from '../../types/DocUiTypes';

const DocButton = ({ action, style, text, width, height, border, borderRadius }: DocButtonProps) => {
     return (
          <button onClick={action} className={style === 'whole' ? 'docButton' : 'docButtonOutline'}
               style={{
                    width: width,
                    height: height,
                    border: border,
                    borderRadius: borderRadius
               }}>
               {text}
          </button>
     )
}

export default DocButton;