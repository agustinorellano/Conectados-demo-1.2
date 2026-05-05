import { useEffect, useMemo, useRef, useState } from 'react';
import {
  QUICK_QUESTIONS,
  buildAssistantReply,
  createWelcomeMessage
} from '../../utils/assistant';

function AssistantAvatar({ compact = false, pulse = false }) {
  return (
    <div className={compact ? 'assistant-avatar compact' : 'assistant-avatar'}>
      <div className="assistant-orb" />
      {pulse && <span className="assistant-pulse-dot" />}
    </div>
  );
}

function AssistantMessage({ message }) {
  const blocks = message.content.split('\n').filter(Boolean);

  return (
    <div className={message.role === 'user' ? 'assistant-row user' : 'assistant-row'}>
      {message.role === 'assistant' && <AssistantAvatar compact />}
      <div className={message.role === 'user' ? 'assistant-bubble user' : 'assistant-bubble'}>
        {blocks.map((block) => (
          <p key={block}>{block}</p>
        ))}
      </div>
    </div>
  );
}

function AssistantView({
  aiEnabled = false,
  company,
  matches,
  recommendations,
  recommendedCompanies,
  actionItems
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const conversationStarters = useMemo(
    () => [
      'Analisis de negocio actual',
      'Ideas de alianzas por segmento',
      'Deteccion de cuellos de botella operativos'
    ],
    []
  );

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: createWelcomeMessage(company.name)
      }
    ]);
  }, [company.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = (text) => {
    const nextInput = (text || input).trim();
    if (!nextInput || loading) {
      return;
    }

    setInput('');
    setLoading(true);
    setMessages((current) => [...current, { role: 'user', content: nextInput }]);

    window.setTimeout(() => {
      const reply = buildAssistantReply({
        input: nextInput,
        company,
        actions: actionItems,
        recommendations,
        recommendedCompanies,
        matches
      });

      setMessages((current) => [...current, { role: 'assistant', content: reply }]);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="view-stack">
      <section className="section-header">
        <div>
          <p className="eyebrow">Asistente virtual</p>
          <h2>Tu consultor de negocio inteligente, siempre dentro de Data Plus.</h2>
        </div>
      </section>

      <section className="assistant-shell">
        <article className="glass-card assistant-chat-card">
          <div className="assistant-header">
            <div className="assistant-header-main">
              <AssistantAvatar pulse />
              <div>
                <h3>Asistente Virtual</h3>
                <p>Analiza, prioriza y recomienda alianzas en tiempo real.</p>
              </div>
            </div>
            <button
              className="secondary-button"
              onClick={() =>
                setMessages([
                  {
                    role: 'assistant',
                    content: createWelcomeMessage(company.name)
                  }
                ])
              }
              type="button"
            >
              Reiniciar
            </button>
          </div>

          <div className="assistant-message-list">
            {messages.map((message, index) => (
              <AssistantMessage key={`${message.role}-${index}`} message={message} />
            ))}

            {loading && (
              <div className="assistant-row">
                <AssistantAvatar compact />
                <div className="assistant-bubble typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="assistant-quick-actions">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  className="assistant-chip"
                  key={question}
                  onClick={() => sendMessage(question)}
                  type="button"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <div className="assistant-input-row">
            <input
              disabled={loading}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Escribi tu consulta..."
              value={input}
            />
            <button
              className="primary-button assistant-send-button"
              disabled={!input.trim() || loading}
              onClick={() => sendMessage()}
              type="button"
            >
              Enviar
            </button>
          </div>
        </article>

        <aside className="assistant-side-column">
          <article className="glass-card assistant-info-card">
            <h3>Contexto disponible</h3>
            <ul className="clean-list">
              <li>{company.name}</li>
              <li>{matches.length} matches activos</li>
              <li>{actionItems.length} acciones cargadas</li>
              <li>{recommendedCompanies.length} empresas evaluables</li>
            </ul>
          </article>

          <article className="glass-card assistant-info-card">
            <h3>Conversaciones guardadas</h3>
            <div className="assistant-saved-list">
              {conversationStarters.map((item) => (
                <div className="assistant-saved-item" key={item}>
                  <strong>{item}</strong>
                  <span>Disponible</span>
                </div>
              ))}
            </div>
          </article>

          <article className="glass-card assistant-info-card">
            <h3>Modos</h3>
            <div className="tag-row">
              <span className="tag">Analitico</span>
              <span className="tag">Estrategico</span>
              <span className="tag">Creativo</span>
              {aiEnabled ? <span className="tag">IA Premium</span> : null}
            </div>
            <p className="muted-text">
              {aiEnabled
                ? 'Sugerencias avanzadas de mercado y aliados habilitadas por plan Scale.'
                : 'Las sugerencias avanzadas de IA se habilitan en el plan Scale.'}
            </p>
          </article>
        </aside>
      </section>
    </div>
  );
}

export default AssistantView;
