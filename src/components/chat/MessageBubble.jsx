function MessageBubble({ message }) {
  const isOwn = message.sender === 'me';

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} chat-message-enter`}>
      <div
        className={`max-w-[78%] rounded-[20px] px-4 py-3 shadow-sm ${
          isOwn
            ? 'rounded-br-md bg-gradient-to-r from-[#1871D8] to-[#0B412F] text-white'
            : 'rounded-bl-md bg-slate-100 text-[#1A1A1A]'
        }`}
      >
        <p className="text-sm leading-6">{message.text}</p>
        <div
          className={`mt-2 text-[11px] font-medium ${
            isOwn ? 'text-white/72' : 'text-slate-500'
          }`}
        >
          {message.time}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
