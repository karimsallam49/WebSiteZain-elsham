
type SectionNameProps = {
  title: string;
};
export const SectionName = ({ title }: SectionNameProps) => {

  return (
    <h4  style={{
     display: "inline-block",
     borderBottom: "3px solid var(--MainColor)",
     padding: "10px 0",
     color: "var(--MainColor)"
   }} className="text-center m-2   fw-bold"> {title}</h4>
  )
}
