function TextField({ label, name, value, onChange, type = 'text', required = false, placeholder = '', min }) {
  return (
    <label className="campo-field">
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
      />
    </label>
  );
}

export default TextField;
