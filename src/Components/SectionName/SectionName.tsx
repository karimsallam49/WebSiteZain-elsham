
type SectionNameProps = {
  title: string;
};
export const SectionName = ({ title }: SectionNameProps) => {

  return (
    <h4  style={{
     display: "inline-block",
     borderBottom: "3px solid #722914",
     padding: "10px 0",
     color: "#722914"
   }} className="text-center m-2   fw-bold"> {title}</h4>
  )
}
