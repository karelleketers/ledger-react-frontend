export interface RadioProps {
    field: {
        name: string, 
        value: string, 
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => void}
    id: string
    label: string
  }
  
  export const RadioButton = ({ field: {name, value, onChange, onBlur}, id, label, ...props}: RadioProps) => {
    return (
      <div>
          <input
            name={name}
            id={id}
            type="radio"
            value={id}
            checked={id === value}
            onChange={onChange}
            onBlur={onBlur}
            {...props}
          />
          <label htmlFor={id}>
              {label}
          </label>
      </div>
    )
  }