import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { collection, doc, getDocs, addDoc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { firebaseDb as db, firebaseAuth, firebaseGoogleProvider, firebaseSetPersistance, firebaseBrowserLocalPersistence, firebaseSignInWithPopup, firebaseSignOut } from '../../config/firebase';
import { toast } from 'sonner';

export const apiSlice = createApi({
  /* reducerPath: 'api', */
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({

    /* CONTACTS -> ADMIN */
    getContactsCompany: builder.query({
      async queryFn() {
        try {
          // retrieve documents
          const ref = collection(db, 'contactsCompany');
          const querySnapshot = await getDocs(ref);
          let contacts = [];
          querySnapshot?.forEach((doc) => {
            contacts.push({ id: doc.id, ...doc.data() });
          });

          /* order by name */
          contacts.sort((a, b) => a.name.localeCompare(b.name));

          return { data: contacts };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      providesTags: ['contactsCompany'],
    }),
    addContactCompany: builder.mutation({
      async queryFn(contact) {
        try {
          // add a new document with a generated id
          const res = await addDoc(collection(db, "contactsCompany"), {
            ...contact,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          return {
            data: {
              ...contact,
              id: res.id,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      invalidatesTags: ['contactsCompany'],
    }),
    deleteContactCompany: builder.mutation({
      async queryFn(id) {
        try {
          const docRef = doc(collection(db, "contactsCompany"), id)
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
      invalidatesTags: ['contactsCompany'],
    }),
    editContactCompany: builder.mutation({
      async queryFn(contact) {
        try {
          const docRef = doc(db, "contactsCompany", contact.id)
          await setDoc(docRef, {
            ...contact,
            updatedAt: serverTimestamp()
          })

          return {
            data: {
              ...contact,
              updatedAt: serverTimestamp()
            }
          }
        } catch (error) {
          console.log(error)
          return { error: error }
        }
      },
      invalidatesTags: ['contactsCompany'],
    }),

    /* DEVICES -> ADMIN */
    getDevicesCompany: builder.query({
      async queryFn() {
        try {
          // retrieve documents
          const ref = collection(db, 'devicesCompany');
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
      providesTags: ['devicesCompany'],
    }),
    addDeviceCompany: builder.mutation({
      async queryFn(device) {
        try {
          // add a new document with a generated id
          const res = await addDoc(collection(db, "devicesCompany"), {
            ...device,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          return {
            data: {
              ...device,
              id: res.id,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      invalidatesTags: ['devicesCompany'],
    }),
    deleteDeviceCompany: builder.mutation({
      async queryFn(id) {
        try {
          const docRef = doc(collection(db, "devicesCompany"), id)
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
      invalidatesTags: ['devicesCompany'],
    }),
    editDeviceCompany: builder.mutation({
      async queryFn(device) {
        try {
          const docRef = doc(db, "devicesCompany", device.id)
          await setDoc(docRef, {
            ...device,
            updatedAt: serverTimestamp()
          })

          return {
            data: {
              ...device,
              updatedAt: serverTimestamp()
            }
          }
        } catch (error) {
          console.log(error)
          return { error: error }
        }
      },
      invalidatesTags: ['devicesCompany'],
    }),

    /* CONTACTS */
    getContacts: builder.query({
      async queryFn(userId) {
        if (!userId) { return }
        try {
          // retrieve documents
          const ref = collection(db, 'authUsersData', userId, "contacts");
          const querySnapshot = await getDocs(ref);
          let contacts = [];
          querySnapshot?.forEach((doc) => {
            contacts.push({ id: doc.id, ...doc.data() });
          });

          /* order by name */
          /* contacts.sort((a, b) => a.name.localeCompare(b.name)); */

          return { data: contacts };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      providesTags: ['contacts'],
    }),
    addContact: builder.mutation({
      async queryFn(contact) {
        try {
          // add a new document with a generated id
          const res = await addDoc(collection(db, "authUsersData", contact.userId, "contacts"), {
            ...contact,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          toast.message('Contact added', {
            description: `ID: ${res.id}`,
          })

          return {
            data: {
              ...contact,
              id: res.id,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      invalidatesTags: ['contacts'],
    }),
    deleteContact: builder.mutation({
      async queryFn(contact) {
        try {
          const docRef = doc(collection(db, "authUsersData", contact.userId, "contacts"), contact.id)
          await deleteDoc(docRef)

          toast.message('Contact deleted', {
            description: `ID: ${contact.id}`,
          })

          return {
            data: {
              id: contact.id,
              res: `eliminated`
            }
          }
        } catch (error) {
          console.log(error);
          return { error: error };
        }

      },
      invalidatesTags: ['contacts'],
    }),
    editContact: builder.mutation({
      async queryFn(contact) {
        try {
          const docRef = doc(collection(db, "authUsersData", contact.userId, "contacts"), contact.id)
          await setDoc(docRef, {
            ...contact,
            updatedAt: serverTimestamp()
          })

          toast.message('Contact edited', {
            description: `ID: ${contact.id}`,
          })

          return {
            data: {
              ...contact,
              updatedAt: serverTimestamp()
            }
          }
        } catch (error) {
          console.log(error)
          return { error: error }
        }
      },
      invalidatesTags: ['contacts'],
    }),

    /* DEVICES */
    getDevices: builder.query({
      async queryFn(userId) {
        if (!userId) { return }
        try {
          // retrieve documents
          const ref = collection(db, 'authUsersData', userId, "devices");
          const querySnapshot = await getDocs(ref);
          let devices = [];
          querySnapshot?.forEach((doc) => {
            devices.push({ id: doc.id, ...doc.data() });
          });

          /* order by name */
          /* devices.sort((a, b) => a.name.localeCompare(b.name)); */

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
          const res = await addDoc(collection(db, "authUsersData", device.userId, "devices"), {
            ...device,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          toast.message('Device added', {
            description: `ID: ${res.id}`,
          })

          return {
            data: {
              ...device,
              id: res.id,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
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
      async queryFn(device) {
        try {
          const docRef = doc(collection(db, "authUsersData", device.userId, "devices"), device.id)
          await deleteDoc(docRef)

          toast.message('Device deleted', {
            description: `ID: ${device.id}`,
          })

          return {
            data: {
              id: device.id,
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
          const docRef = doc(collection(db, "authUsersData", device.userId, "devices"), device.id)
          await setDoc(docRef, {
            ...device,
            updatedAt: serverTimestamp()
          })

          toast.message('Device edited', {
            description: `ID: ${device.id}`,
          })

          return {
            data: {
              ...device,
              updatedAt: serverTimestamp()
            }
          }
        } catch (error) {
          console.log(error)
          return { error: error }
        }
      },
      invalidatesTags: ['devices'],
    }),

    /* TDL */
    getTdl: builder.query({
      async queryFn(userId) {
        if (!userId) { return }
        try {
          // retrieve documents
          const ref = collection(db, 'authUsersData', userId, "tdl");
          const querySnapshot = await getDocs(ref);
          let tasks = [];

          querySnapshot?.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });

          /* order by date */
          /*  tasks.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()); */

          return { data: tasks };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      providesTags: ['tdl'],
    }),
    addTdl: builder.mutation({
      async queryFn(task) {
        try {
          const res = await addDoc(collection(db, "authUsersData", task.userId, "tdl"), {
            ...task,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          toast.message('Task added', {
            description: `ID: ${res.id}`,
          })

          return {
            data: {
              ...task,
              id: res.id,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      invalidatesTags: ['tdl'],
    }),
    deleteTdl: builder.mutation({
      async queryFn(task) {
        try {
          const docRef = doc(collection(db, "authUsersData", task.userId, "tdl"), task.id)
          await deleteDoc(docRef)

          toast.message('Task deleted', {
            description: `ID: ${task.id}`,
          })

          return {
            data: {
              id: task.id,
              res: `eliminated`
            }
          }
        } catch (error) {
          console.log(error);
          return { error: error };
        }

      },
      invalidatesTags: ['tdl'],
    }),
    editTdl: builder.mutation({
      async queryFn(task) {
        try {
          const docRef = doc(collection(db, "authUsersData", task.userId, "tdl"), task.id)
          await setDoc(docRef, {
            ...task,
            updatedAt: serverTimestamp()
          })

          toast.message('Task edited', {
            description: `ID: ${task.id}`,
          })

          return {
            data: {
              ...task,
              updatedAt: serverTimestamp()
            }
          }
        } catch (error) {
          console.log(error)
          return { error: error }
        }
      },
      invalidatesTags: ['tdl'],
    }),

    /* SUPPORT */
    getSupport: builder.query({
      async queryFn(userId) {
        if (!userId) { return }
        try {
          // retrieve documents
          const ref = collection(db, 'authUsersData', userId, "support");
          const querySnapshot = await getDocs(ref);
          let tickets = [];

          querySnapshot?.forEach((doc) => {
            tickets.push({ id: doc.id, ...doc.data() });
          });

          /* order by date */
          /*  tasks.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()); */

          return { data: tickets };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      providesTags: ['support'],
    }),
    addSupport: builder.mutation({
      async queryFn(ticket) {
        try {
          const res = await addDoc(collection(db, "authUsersData", ticket.userId, "support"), {
            ...ticket,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          toast.message('Ticket added', {
            description: `ID: ${res.id}`,
          })

          return {
            data: {
              ...ticket,
              id: res.id,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      invalidatesTags: ['support'],
    }),
    deleteSupport: builder.mutation({
      async queryFn(ticket) {
        try {
          const docRef = doc(collection(db, "authUsersData", ticket.userId, "support"), ticket.id)
          await deleteDoc(docRef)

          toast.message('Ticket deleted', {
            description: `ID: ${ticket.id}`,
          })

          return {
            data: {
              id: ticket.id,
              res: `eliminated`
            }
          }
        } catch (error) {
          console.log(error);
          return { error: error };
        }

      },
      invalidatesTags: ['support'],
    }),
    editSupport: builder.mutation({
      async queryFn(ticket) {
        try {
          const docRef = doc(collection(db, "authUsersData", ticket.userId, "tdl"), ticket.id)
          await setDoc(docRef, {
            ...ticket,
            updatedAt: serverTimestamp()
          })

          toast.message('Ticket edited', {
            description: `ID: ${ticket.id}`,
          })

          return {
            data: {
              ...ticket,
              updatedAt: serverTimestamp()
            }
          }
        } catch (error) {
          console.log(error)
          return { error: error }
        }
      },
      invalidatesTags: ['support'],
    }),

    /* AUTH */
    signGoogle: builder.mutation({
      async queryFn() {
        try {
          // Set the persistence to browserSessionPersistence
          await firebaseSetPersistance(firebaseAuth, firebaseBrowserLocalPersistence);

          const result = await firebaseSignInWithPopup(firebaseAuth, firebaseGoogleProvider);
          const user = result.user;

          toast.message('Auth', {
            description: `User signed in: ${user.displayName}`,
          })

          return { data: user };
        } catch (error) {
          console.error(error);
          return { error: error };
        }
      },
    }),
    signOut: builder.mutation({
      async queryFn() {
        try {
          await firebaseSignOut(firebaseAuth);

          toast.message('Auth', {
            description: `User signed out`,
          })

          return { data: { message: 'Signed out successfully' } };
        } catch (error) {
          console.error(error);
          return { error: error };
        }
      },
    }),
    getCurrentUser: builder.query({
      async queryFn() {
        try {
          // retrieve user
          const user = firebaseAuth.currentUser
          return { data: user };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      }
    })
  })
})

export default apiSlice.reducer
export const {
  useGetContactsCompanyQuery,
  useAddContactCompanyMutation,
  useDeleteContactCompanyMutation,
  useEditContactCompanyMutation,

  useGetContactsQuery,
  useAddContactMutation,
  useDeleteContactMutation,
  useEditContactMutation,

  useGetDevicesCompanyQuery,
  useAddDeviceCompanyMutation,
  useDeleteDeviceCompanyMutation,
  useEditDeviceCompanyMutation,

  useGetDevicesQuery,
  useAddDeviceMutation,
  useDeleteDeviceMutation,
  useEditDeviceMutation,

  useGetTdlQuery,
  useAddTdlMutation,
  useDeleteTdlMutation,
  useEditTdlMutation,

  useGetSupportQuery,
  useAddSupportMutation,
  useDeleteSupportMutation,
  useEditSupportMutation,

  useSignGoogleMutation,
  useSignOutMutation,
  useGetCurrentUserQuery,
} = apiSlice
