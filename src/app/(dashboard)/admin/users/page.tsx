"use client";

import { getUsersData } from "@/fetch/users";
import { Users as usersTypes } from "@/constant/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { DateComponent } from "@/components/Date";

const Users = () => {
  const { data: users, isLoading } = useQuery<usersTypes[]>({
    queryKey: ["users-data"],
    queryFn: getUsersData,
  });

  return (
    <>
      <h2 className="text-2xl font-bold p-2">Users</h2>
      <ul className="flex flex-col gap-2 mt-6">
        {users &&
          users.map((user, index) => (
            <li
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg border"
            >
              <span className="font-bold">{user.username}</span>
              <span>{user.email}</span>
              <span>{user.role}</span>
              <span className="text-green-600">{user.status}</span>
              <span>
                <DateComponent date={user.created_at} />
              </span>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Users;
