import { FieldAttributes, useField } from 'formik'
import React from 'react'
import { TextField, TextFieldProps} from './TextField';

export const TextFieldError: React.FC<TextFieldProps & FieldAttributes<{}>> = ({
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <>
      <TextField
      {...field}
      label={props.label} 
      type={props.type} 
      placeholder={props.placeholder}
      value={props.value} 
      format={props.format}/>
      {errorText &&
        <div style={{color: '#ED593E', marginTop: -40}}>
          {errorText}
        </div>
      }
    </>
  );
};