import React from 'react'
import CreateForm from './_components/createForm';


function Dashboard() {
  return (
    <div>
      <h2 className='font-bold text-3xl flex items-center justify-between gap-20 p-5'>Dashboard
        <CreateForm></CreateForm>
      </h2>
    </div>
  )
}

export default Dashboard