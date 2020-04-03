import React, { forwardRef, useRef } from 'react'
import PropTypes from 'prop-types'

import { Formik, Form as FormikForm, FieldArray } from 'formik'
import CurrencyInput from './ValidatedCurrencyInput'
import Option from '@kogaio/Dropdown/Option'
import Input from './ValidatedInput'
import TextArea from './ValidatedTextArea'
import Dropdown from './ValidatedDropdown'
import FileInput from './ValidatedFileInput'
import RadioButton from './ValidatedRadioButton'

/**
 * `<Form>` is a a wrapper around formik's components `<Formik>` and `<Form>`.
 *
 * Its purpose is to reduce formik references in turn potentially reducing
 * the effort required for adapting to formik's changes.
 *
 * `<Form>` also allows shorthand for validated elements such as
 * Input, TextArea, Dropdown, FileInput, RadioButton, SuggestUsers.
 
 * Simply use it as such `<Form.Input {..yourprops} />`
 
 `<Form.Dropdown {...yourprops}>
      <Form.DropdownOption />
    </Form.DropdownOption>
  `, etc.
 */

const Form = forwardRef(
  (
    {
      children,
      component,
      enableReinitialize,
      formStyle,
      id,
      isInitialValid,
      initialValues,
      onReset: handleReset,
      onSubmit: handleSubmit,
      validationSchema,
      validateOnBlur,
      validateOnChange,
      validateOnMount
    },
    ref
  ) => {
    const formRef = useRef()
    return (
      <Formik
        component={component}
        enableReinitialize={enableReinitialize}
        isInitialValid={isInitialValid}
        initialValues={initialValues}
        onReset={handleReset}
        onSubmit={handleSubmit}
        validateOnBlur={validateOnBlur}
        validateOnChange={validateOnChange}
        validateOnMount={validateOnMount}
        validationSchema={validationSchema}>
        {component ??
          (formProps => (
            <FormikForm
              id={id}
              ref={ref ?? formRef}
              style={formStyle}
              noValidate>
              {children(formProps)}
            </FormikForm>
          ))}
      </Formik>
    )
  }
)

Form.propTypes = {
  component: PropTypes.node,
  children: PropTypes.func.isRequired,
  enableReinitialize: PropTypes.bool,
  formStyle: PropTypes.object,
  id: PropTypes.string,
  initialValues: PropTypes.object.isRequired,
  isInitialValid: PropTypes.bool,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  validationSchema: PropTypes.any,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool,
  validateOnMount: PropTypes.bool
}

Form.FieldArray = FieldArray
Form.CurrencyInput = CurrencyInput
Form.Dropdown = Dropdown
Form.DropdownOption = Option
Form.FileInput = FileInput
Form.Input = Input
Form.RadioButton = RadioButton
Form.TextArea = TextArea

export default Form
