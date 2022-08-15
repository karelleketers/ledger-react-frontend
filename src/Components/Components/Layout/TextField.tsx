import {ReactComponent as EyeIcon} from './../../../assets/images/eye.svg';
import { useField } from 'formik';
import { useState } from 'react';

export interface TextFieldProps {
  type: string
  value?: string
  placeholder?: string
  label: string
  name: string
  format?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

export const TextField = ({ label, type, onChange, format, ...props }: TextFieldProps) => {
  const [field, meta] = useField(props);
  const [showPW, setShowPW] = useState(false)
  // eslint-disable-next-line 
  const errorText = meta.error && meta.touched ? meta.error : ""
  return (
    <div className={`${format === "styled" && 'flex items-center justify-between my-12'}`}>
      <section className={`${format === "styled" && 'flex flex-col w-3/5'}`}>
        <label htmlFor={props.name} className={`${format === "styled" && "font-nunitomedium uppercase text-xl my-2"}`}>{label}</label>
        <input {...field} {...props} onChange={onChange} type={showPW ? "text" : type} className={`${format === "styled" ? 'border-b-gray-200 bg-transparent' : "hover:border-gray-200 transition-300 mx-2"} text-mdgreen font-nunitoblack border border-transparent`}/>
      </section>
      {type === "password" ? <div onMouseEnter={() => {setShowPW(true)}} onMouseLeave={() => {setShowPW(false)}} className='opacity-60 hover:opacity-100 duration-300 pt-12 cursor-none'><EyeIcon className='w-12 fill-light h-12 cursor-pointer'/></div> : ""}
    </div>
  )
}