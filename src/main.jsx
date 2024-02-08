import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import init, { greet } from "../pkg/strobe_tuner.js"

init().then(() => greet());

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
