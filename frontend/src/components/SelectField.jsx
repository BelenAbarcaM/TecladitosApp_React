function SelectField({ label, name, value, onChange, opciones, placeholder = 'Seleccione...' }) {
  return (
    <label className="campo-field">
      <span>{label}</span>
      <select name={name} value={value} onChange={onChange}>
        {placeholder && <option value="">{placeholder}</option>}
        {opciones.map((opcion) => (
          <option value={opcion} key={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </label>
  );
}

export default SelectField;
