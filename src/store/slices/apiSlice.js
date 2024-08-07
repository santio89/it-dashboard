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

          /* order by name */
          users.sort((a, b) => a.name.localeCompare(b.name));

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
    }),
    getDevices: builder.query({
      async queryFn() {
        try {
          // retrieve documents
          const ref = collection(db, 'devices');
          const querySnapshot = await getDocs(ref);
          let devices = [];
          querySnapshot?.forEach((doc) => {
            devices.push({ id: doc.id, ...doc.data() });
          });

          /* order by name */
          devices.sort((a, b) => a.name.localeCompare(b.name));

          return { data: devices };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      providesTags: ['devices'],
    }),
    addDevice: builder.mutation({
      async queryFn(device) {
        try {
          // add a new document with a generated id
          const res = await addDoc(collection(db, "devices"), device);

          return {
            data: {
              ...device,
              id: res.id
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      invalidatesTags: ['devices'],
    }),
    deleteDevice: builder.mutation({
      async queryFn(id) {
        try {
          const docRef = doc(collection(db, "devices"), id)
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
      invalidatesTags: ['devices'],
    }),
    editDevice: builder.mutation({
      async queryFn(device) {
        try {
          const docRef = doc(db, "devices", device.id)
          await setDoc(docRef, device)

          return {
            data: device
          }
        } catch (error) {
          console.log(error)
          return { error: error }
        }
      },
      invalidatesTags: ['devices'],
    }),
  })
})

export default apiSlice.reducer
export const { useGetUsersQuery, useAddUserMutation, useDeleteUserMutation, useEditUserMutation, useGetDevicesQuery, useAddDeviceMutation, useDeleteDeviceMutation, useEditDeviceMutation } = apiSlice
