import './formInput.css';

const FormInput = ({
    type, name, value, handleChange, placeholder, error, required
}) => {

    return (
        <div className="form">
            <div className="form-input">
                <input
                    className="input"
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                />
                {error && <span className="error-message">{error}</span>}
            </div>
        </div>
    )
}

export default FormInput
