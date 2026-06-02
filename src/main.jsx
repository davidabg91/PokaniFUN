import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { LangProvider, LanguageToggle } from './i18n.jsx'
import CreatePage from './pages/CreatePage.jsx'
import InvitePage from './pages/InvitePage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import NotFound from './pages/NotFound.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <BrowserRouter>
        <LanguageToggle />
        <Routes>
          <Route path="/" element={<CreatePage />} />
          <Route path="/i/:id" element={<InvitePage />} />
          <Route path="/r/:id" element={<ResultsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  </React.StrictMode>
)
