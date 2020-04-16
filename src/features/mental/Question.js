import React from 'react';

import MathField from 'react-mathfield'



export default function Question ({text, fontSize}) {
    return (
        <div style={{ fontSize }}>
            <MathField  latex={text}  />
        </div>
    )
}