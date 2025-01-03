export const OptimizedForm: React.FC<FormProps> = ({ onSubmit }) => {
  return (
    <form 
      onSubmit={onSubmit}
      className="conversion-form"
      itemScope 
      itemType="http://schema.org/ContactPoint"
    >
      <input
        type="text"
        name="name"
        required
        aria-label="Ваше имя"
        placeholder="Ваше имя"
        autoComplete="name"
      />
      
      <input
        type="email"
        name="email"
        required
        aria-label="Ваш email"
        placeholder="Ваш email"
        autoComplete="email"
      />

      <button 
        type="submit"
        className="submit-button"
      >
        Отправить
      </button>
    </form>
  );
}; 