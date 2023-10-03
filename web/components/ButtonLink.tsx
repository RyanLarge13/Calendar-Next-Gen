import Link from "next/link";

const ButtonLink = ({
  styles,
  route,
  text,
  type,
}: {
  styles: string;
  route: string;
  text: string;
  type: string;
}) => {
  return (
    <button type={type} className={styles}>
      <Link href={route}></Link>
      {text}
    </button>
  );
};

export default ButtonLink;
