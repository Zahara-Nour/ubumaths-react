import React from 'react';
import 'katex/dist/katex.min.css'
import TeX from '@matejmazur/react-katex'



export default function Question ({text}) {
    return (
        <div style={{ fontSize:100}}>
            <TeX  math={text} block />
        </div>
    )
}