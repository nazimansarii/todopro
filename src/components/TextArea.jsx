import React from 'react'

export const TextArea = ({ id, title, cols, rows, className, error }) => {
    return (
        <div className='w-full  flex flex-col py-1.5 mt-4'>
            <div className='flex justify-between items-center '>
                <label htmlFor={id} className='text-inherit'>{title}</label>
                <span className='text-red-500 '>{error}</span>
            </div>
            <textarea id={id} cols={cols} rows={rows} className={className}></textarea>
            <span></span>
        </div>
    )
}
