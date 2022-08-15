export interface ButtonProps {
  type: "submit" | "button" | "reset" | undefined
  disabled?: boolean
  content: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const Button = ({ type, content, disabled = false, onClick}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
      </button>
  )
}