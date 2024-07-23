import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { collection, doc, getDocs, addDoc, deleteDoc, setDoc } from "firebase/firestore";
import { firebaseDb as db } from '../../config/firebase';

export const apiSlice = createApi({
  /* reducerPath: 'api', */
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    getUsers: builder.query({
      async queryFn() {
        try {
          // retrieve documents
          const ref = collection(db, 'users');
          const querySnapshot = await getDocs(ref);
          let users = [];
          querySnapshot?.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
          });

          return { data: users };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      providesTags: ['users'],
    }),
    addUser: builder.mutation({
      async queryFn(user) {
        try {
          // add a new document with a generated id
          const res = await addDoc(collection(db, "users"), user);

          return {
            data: {
              ...user,
              id: res.id
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      invalidatesTags: ['users'],
    }),
    deleteUser: builder.mutation({
      async queryFn(id) {
        try {
          const docRef = doc(collection(db, "users"), id)
          await deleteDoc(docRef)

          return {
            data: {
              id,
              res: `eliminated`
            }
          }
        } catch (error) {
          console.log(error);
          return { error: error };
        }

      },
      invalidatesTags: ['users'],
    }),
    editUser: builder.mutation({
      async queryFn(user) {
        try {
          const docRef = doc(db, "users", user.id)
          await setDoc(docRef, user)

          return {
            data: user
          }
        } catch (error) {
          console.log(error)
          return { error: error }
        }
      },
      invalidatesTags: ['users'],
    })
  })
})

export default apiSlice.reducer
export const { useGetUsersQuery, useAddUserMutation, useDeleteUserMutation, useEditUserMutation } = apiSlice
