import Link from "next/link";

const ButtonLink = ({
  styles,
  route,
  text,
}: {
  styles: string;
  route: string;
  text: string;
}) => {
  return (
    <button type="button" className={styles}>
      <Link href={route}></Link>
      {text}
    </button>
  );
};

export default ButtonLink;
