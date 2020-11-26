import { dbTable } from 'Firebase';

const { useItem, useList, dbCreate, dbDelete, dbUpdate } = dbTable<
  UserType,
  UserType
>('users', 'idUser');

export const useUser = useItem;

export const useUsers = () => useList();

export const createUser = dbCreate;

export const updateUser = dbUpdate;

export const deleteUser = dbDelete;
