import './App.css';
import { Editor } from './component/editor/editor';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {v4 as uuid} from 'uuid';

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="" element={<Navigate replace to={`/${uuid()}`} />} />
        <Route path='/:id' element={<Editor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
