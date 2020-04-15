import React from 'react';
import 'katex/dist/katex.min.css'
import TeX from '@matejmazur/react-katex'



export default function Question ({text, fontSize}) {
    return (
        <div style={{ fontSize }}>
            <TeX  math={text} block />
        </div>
    )
}