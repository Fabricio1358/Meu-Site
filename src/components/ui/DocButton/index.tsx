// src\components\ui\DocButton\index.tsx
import './DocButton.css'
import type { MouseEventHandler } from 'react';

interface DocButtonProps {
     action: MouseEventHandler;
     style: 'whole' | 'outline';
     text?: string;
     width: string;
     height: string;
     border?: string;
     borderRadius?: string;
}

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