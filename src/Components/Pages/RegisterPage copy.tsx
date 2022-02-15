/* import { useEffect, useState } from 'react' */
import { Formik, /* Form, */ Field } from 'formik'
import * as yup from 'yup';
import { TextField, TextFieldError, /* Button */ } from '../Components'
/* import {REGISTER_USER_MUTATION} from '../../GraphQL/Mutations'
import {useMutation} from '@apollo/client'; */
/* import { useNavigate } from 'react-router';
import * as Routes from '../../routes' */

/* interface Register {
    email: string,
    password: string,
    firstName: string,
    lastName: string
    passwordCheck: string,
} */

const validationSchema = yup.object({
    firstName: yup.string().required().min(2),
    lastName: yup.string().required().min(2),
    email: yup.string().email().required().max(64),
    password: yup.string().required().min(8),
    passwordCheck: yup.string().oneOf([yup.ref('password'), null], "passwords must match").required(),
  })

export const RegisterPage = () => {
    /* const [register, setRegister] = useState<Register>({
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    });
 */
    /* const [registerUser, {error}] = useMutation(REGISTER_USER_MUTATION);

    if (error) {console.log(error)}; */

    /* const addUser = (values: Register) => {
        registerUser({
            variables: {
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
            }
        })
    } */

    return (
        <Formik
            initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                passwordCheck: "" 
            }}

            validationSchema={validationSchema}

            /* onSubmit={ async(values)=> { 
            console.log(values);
            console.log('submitting')
            }}
            > */

            onSubmit={(data, { setSubmitting, resetForm }) => { 
                console.log('yaaay')
                setSubmitting(true)  
                resetForm({})
                setSubmitting(false)  
             }}
            >
                
            {({ values, isSubmitting }) => {
                return(
                    <form>
                        <section>
                            <Field name="firstName" type={"text"} label="Your firstname" as={TextFieldError}/>
                            <Field name="lastName" type={"text"} label="Your lastname" as={TextField}/>
                        </section>
                        <Field name="email" type={"email"} label="Your e-mailadress" as={TextFieldError}/>
                        <Field name="password" type={"password"} label="Password" as={TextFieldError}/>
                        <Field name="passwordCheck" type={"password"} label="Password confirmation" as={TextFieldError}/>
                        {/* <Button linkTo={ Routes.GETTINGSTARTED } disabled={isSubmitting} type="submit" onClick={() => {addUser(values)}} content="Sign up"/> */}
                        <button onClick={() => {console.log('submitting')}}>Submit here</button>
                    </form>
                )
            }}
        </Formik>
    )
}
