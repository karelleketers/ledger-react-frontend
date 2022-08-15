import { useField } from 'formik'

export interface RadioGroupProps {
    name: string,
    value?: string,
    id: string,
    label: string,
    children: React.ReactNode,
  }
  
  export const RadioButtonGroup = ({ label, children, ...props}: RadioGroupProps) => {

    const [field, meta] = useField<{}>(props);
    const errorText = meta.error && meta.touched ? meta.error : "";

    return (
      <div>
          <fieldset {...field}>
            <legend>{label}</legend>
            {children}
            {errorText &&
            <div style={{backgroundColor: 'red', color: 'white'}}>
            {errorText}
            </div>}
        </fieldset>
      </div>
    )
  }