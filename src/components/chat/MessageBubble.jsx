function MessageBubble({ message }) {
  const isOwn = message.sender === 'me';

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} chat-message-enter`}>
      <div
        className={`max-w-[78%] px-[14px] py-3 ${
          isOwn
            ? 'rounded-[18px] rounded-tr-sm bg-[#1A2744] text-white shadow-sm'
            : 'rounded-[18px] rounded-tl-sm border border-slate-100 bg-white text-[#1A1A1A] shadow-sm'
        }`}
      >
        <p className="text-[14px] leading-[1.5]">{message.text}</p>
        <div
          className={`mt-1 text-[11px] ${
            isOwn ? 'text-right text-white/55' : 'text-slate-400'
          }`}
        >
          {isOwn ? `${message.time} ✓✓` : message.time}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
