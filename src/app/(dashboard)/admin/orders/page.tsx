"use client";
import { findOrders } from "@/app/actions/order";
import { Orders } from "@/constant/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const AllOrderPage = () => {
  const [allOrder, setAllOrder] = useState<Orders[]>([]);

  useEffect(() => {
    async function getAllOrder() {
      try {
        const response = await findOrders();
        if (response) {
          console.log("response", response);
          setAllOrder(response);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    getAllOrder();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">All Order</h2>
      <ul className="flex flex-col gap-4 my-2">
        {allOrder &&
          allOrder.map((order) => (
            <li key={order._id} className="border rounded-lg p-2">
              <p>Order Number: {order.orderNumber}</p>
              <ul className="flex flex-col gap-3">
                {order?.products?.map((item) => (
                  <li className="flex gap-3">
                    {item?.imageUrl && (
                      <Image
                        src={item?.imageUrl}
                        alt="image"
                        width={500}
                        height={500}
                      />
                    )}
                    <p>{item?.name}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AllOrderPage;