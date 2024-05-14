import React, { createContext, useState, ReactNode } from "react";

export interface UserData {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  imageUrl: string;
  s3Path?: string;
  uploadUrl?: string;
}

interface UserContextType {
  users: UserData[];
  setUsers: (users: UserData[]) => void;
  addUser: (user: UserData) => void;
  editedUser: UserData | null;
  setEditedUser: (user: UserData | null) => void;
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const UserContext = createContext<UserContextType>({
  users: [],
  setUsers: () => {},
  addUser: () => {},
  editedUser: null,
  setEditedUser: () => {},
  isModalOpen: false,
  setModalOpen: () => {},
  isLoading: false,
  setIsLoading: () => {},
});
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addUser = (user: UserData) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        setUsers,
        addUser,
        editedUser,
        setEditedUser,
        isModalOpen,
        setModalOpen,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
