import Link from "next/link"

const ButtonLink = ({styles, route, text, type}) => {
	return <button type={type} className={styles}><Link href={route}></Link>{text}</button>
}

export default ButtonLink