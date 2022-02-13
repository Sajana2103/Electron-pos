import React from 'react'
import './nav-bar.styles.css'

const NavigationBar = ({width}) => {

  console.log(width)
  return (
    <div className='nav-bar' style={{gridTemplateColumns:`220px ${width-400}px 200px`}}>
      <div className='logo'>LOGO</div>
      <div className="nav-btns" >
        <div className='nav-btn'>MENU</div>
        <div className='nav-btn'>TABLES</div>
        <div className='nav-btn'>HISTORY</div>
      </div>
        <div className='nav-btn' style={{ display: 'flex', float: 'right' }}>LOGIN</div>
    </div>
  )
}

export default NavigationBar