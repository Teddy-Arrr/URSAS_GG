import css from './index.module.css'

interface props extends React.HTMLAttributes<HTMLButtonElement>
{

}


export default (props: props) => {
    return <button
        className={[props.className, css.navigation].join(' ')}
        onClick={ props.onClick }
    >
        <svg className={[css.icon].join(' ')} width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.499999 7.86602C-0.166668 7.48112 -0.166667 6.51888 0.5 6.13397L9.5 0.937821C10.1667 0.552921 11 1.03405 11 1.80385L11 12.1962C11 12.966 10.1667 13.4471 9.5 13.0622L0.499999 7.86602Z" fill="#B5C4E3"/>
        </svg>
    </button>
}