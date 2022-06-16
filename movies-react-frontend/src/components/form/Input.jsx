import React from 'react'

const Input = (props) => {
  return (
    <div className='mb-3'>
      {props.type !== 'hidden' ? (
        <label htmlFor={props.name} className='form-label'>
          {props.title}
        </label>
      ) : (
        ''
      )}
      <input
        type={props.type}
        className={`form-control ${props.className}`}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.handleInputChange}
        placeholder={props.placeholder}
      />
      <div className={props.errorDiv}>{props.errorMsg}</div>
    </div>
  )
}

export default Input
