import './Input.css';

export default function CustomInput({ label, children, ...inputProps }) {
  const id = inputProps.id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="input-with-icon floating-label-wrapper">
      <input
        id={id}
        {...inputProps}
        className="input-field"
        placeholder=" "
      />
      <label htmlFor={id} className="floating-label">{label}</label>
      {children}
    </div>
  );
}
