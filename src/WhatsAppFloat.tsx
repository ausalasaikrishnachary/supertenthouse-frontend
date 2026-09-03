const WhatsAppFloat = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "919686521214";
    const message =
      "Hello! I’d like to schedule a consultation with Super Tent House. Please assist me with the process.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-7 h-7 fill-white"
      >
        <path d="M16 .5C7.5.5.5 7.5.5 16c0 2.8.7 5.5 2.1 7.9L.5 31.5l7.8-2.1c2.3 1.3 4.9 2 7.7 2 8.5 0 15.5-7 15.5-15.5S24.5.5 16 .5zm0 28.4c-2.5 0-5-.7-7.1-2l-.5-.3-4.6 1.2 1.2-4.5-.3-.5c-1.3-2.2-2-4.7-2-7.3C2.7 8.7 8.7 2.7 16 2.7s13.3 6 13.3 13.3-6 13-13.3 13zm7.2-9.7c-.4-.2-2.2-1.1-2.6-1.2-.3-.1-.6-.2-.8.2-.2.3-.9 1.2-1.1 1.5-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.6-1.6-1-1-1.6-2.2-1.8-2.5-.2-.3 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.3-.3.4-.6.1-.2 0-.4 0-.6 0-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.3 3.4c.2.2 2.3 3.5 5.5 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 2.2-.9 2.5-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.7-.5z" />
      </svg>
    </button>
  );
};

export default WhatsAppFloat;