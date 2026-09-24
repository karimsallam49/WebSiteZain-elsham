import React from "react";
import "./TableStyle.css";
import type { Order } from "../../DTO/OrderDTO";
import { ImageUrl } from "../../EndPoints/EndPoints";
import { useNavigate } from "react-router";

interface SimpleTableProps {
  columns: string[];
  rows: Order[];
  className?: string;
}

const TableComponent: React.FC<SimpleTableProps> = ({ columns, rows, className }) => {
const now = new Date();
const Navigate =useNavigate()
  return (
    <div className={`table-wrapper ${className || ""}`}>
      <table className="simple-table" role="table" aria-label="simple-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="simple-th">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows&&rows.map((cell, cIdx) =>{
        const deliveryTime = cell.delivery_time; 
        const [hours, minutes, seconds] = deliveryTime.split(":").map(Number);
        const deliveryDate = new Date();
        deliveryDate.setHours(hours, minutes, seconds, 0);

        
        const diffInMs = deliveryDate.getTime() - now.getTime();
        const diffInMinutes = Math.round(diffInMs / 60000); 

        
        const estimatedArrival = diffInMinutes > 0 ? diffInMinutes : 0;

          return(
            <>
           
            <tr className="pointer-event" onClick={()=>Navigate(`/OrderDetails/${cell.id}`)} key={cIdx}>
                <>
                
                <td key={cIdx} className="simp-td d-flex align-items-center justify-content-around " style={{ width:"220px" }}>
                      <span className="d-flex flex-wrap w-100 g-2 align-items-center">
                          {cell.product_images.map((el)=>{
                            return(
                                <div className="rounded-2 m-1">
                                    <img width={40} height={35} className="rounded-2" src={`${ImageUrl}/${el}`} alt="" />
                                </div>
                            )
                        })}
                    </span>
                  <span className=" MainColor  ">
                    <h5 className=" TextMainColor ">
                        #{cell.id}
                        </h5>
                    </span>
                    

                </td>
            <td>
                {cell.total_quantity}
            </td>
            <td>
                {estimatedArrival} دقيقه 
            </td>
            <td>
                {cell.order_amount}
            </td>
            <td>
                {cell.order_status}
            </td>
            
                        </>
            </tr>
             </>
          )})}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
