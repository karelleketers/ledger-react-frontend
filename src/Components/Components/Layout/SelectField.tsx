import React from 'react';
import { useField } from 'formik';
import Select from "react-select";

export interface SelectFieldProps {
    id?: number
    name: string
    options: {value: string, label: string, type?: string, id?: number | null}[]
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

export const SelectField = ({ onChange, id, ...props }: SelectFieldProps) => {
  const [field, meta, helpers] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : ""
  return (
    <div>
        <Select
            name = {props.name}
            value = {field.value}
            options = {props.options}
            onChange={(value) => {helpers.setValue(value)}}
            onBlur={() => {helpers.setTouched(true)}}
        />
        {errorText &&
        <div style={{backgroundColor: 'red', color: 'white'}}>
          {errorText}
        </div>
      }
    </div>
  )
}