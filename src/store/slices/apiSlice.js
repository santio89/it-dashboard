import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { collection, doc, getDocs, addDoc, deleteDoc, setDoc, query, where, serverTimestamp } from "firebase/firestore";
import { firebaseDb as db, firebaseAuth, firebaseGoogleProvider, firebaseSetPersistance, firebaseBrowserLocalPersistence, firebaseSignInWithPopup, firebaseSignOut } from '../../config/firebase';
import { toast } from 'sonner';


export const apiSlice = createApi({
  /* invalidates tags: force refetch -> using optimistic updates instead (with rollbacks) */
  /* serverTimestamp: placeholder -> gets overwritten on db */

  /* reducerPath: 'api', */
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    /* CONTACTS */
    getContacts: builder.query({
      async queryFn(userId) {
        if (!userId) { return }
        try {
          const ref = collection(db, 'authUsersData', userId, "contacts");
          const querySnapshot = await getDocs(ref);
          let contacts = [];
          querySnapshot?.forEach((doc) => {
            contacts.push({ id: doc.id, ...doc.data() });
          });

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
          const newDocRef = doc(collection(db, "authUsersData", contact.userId, "contacts"), contact.localId);

          const newContact = {
            ...contact,
            id: contact.localId,
            createdAt: serverTimestamp(),
            updatedAt: null
          };

          await setDoc(newDocRef, newContact);

          return {
            data: { ...newContact, createdAt: Date.now() }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['contacts'], */
      onQueryStarted: async (contact, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getContacts', contact.userId, draft => {
            draft.push({ ...contact, id: contact.localId, createdAt: Date.now(), updatedAt: null });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    deleteContact: builder.mutation({
      async queryFn(contact) {
        try {
          const docRef = doc(collection(db, "authUsersData", contact.userId, "contacts"), contact.id);
          await deleteDoc(docRef);

          return {
            data: {
              id: contact.id,
              res: `eliminated`
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['contacts'], */
      onQueryStarted: async (contact, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getContacts', contact.userId, draft => {
            return draft.filter(c => c.id !== contact.id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    editContact: builder.mutation({
      async queryFn(contact) {
        try {
          const docRef = doc(collection(db, "authUsersData", contact.userId, "contacts"), contact.id);
          await setDoc(docRef, {
            ...contact,
            updatedAt: serverTimestamp()
          });

          return {
            data: {
              ...contact,
              updatedAt: Date.now()
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['contacts'], */
      onQueryStarted: async (contact, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getContacts', contact.userId, draft => {
            const index = draft.findIndex(c => c.id === contact.id);
            if (index !== -1) {
              draft[index] = { ...contact, updatedAt: Date.now() };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    setContacts: builder.mutation({
      queryFn: () => ({
        url: '',
        method: 'PUT',
      }),
      async onQueryStarted(contactsData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getContacts', contactsData.userId, (draft) => {
            return contactsData;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* DEVICES */
    getDevices: builder.query({
      async queryFn(userId) {
        if (!userId) { return }
        try {
          const ref = collection(db, 'authUsersData', userId, "devices");
          const querySnapshot = await getDocs(ref);
          let devices = [];
          querySnapshot?.forEach((doc) => {
            devices.push({ id: doc.id, ...doc.data() });
          });

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
          const newDocRef = doc(collection(db, "authUsersData", device.userId, "devices"), device.localId);

          const newDevice = {
            ...device,
            id: device.localId,
            createdAt: serverTimestamp(),
            updatedAt: null
          }


          await setDoc(newDocRef, newDevice);

          return {
            data: { ...newDevice, createdAt: Date.now() }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['devices'], */
      onQueryStarted: async (device, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getDevices', device.userId, draft => {
            draft.push({ ...device, id: device.localId, createdAt: Date.now(), updatedAt: null });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    deleteDevice: builder.mutation({
      async queryFn(device) {
        try {
          const docRef = doc(collection(db, "authUsersData", device.userId, "devices"), device.id);
          await deleteDoc(docRef);

          return {
            data: {
              id: device.id,
              res: `eliminated`
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['devices'], */
      onQueryStarted: async (device, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getDevices', device.userId, draft => {
            return draft.filter(d => d.id !== device.id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    editDevice: builder.mutation({
      async queryFn(device) {
        try {
          const docRef = doc(collection(db, "authUsersData", device.userId, "devices"), device.id);
          await setDoc(docRef, {
            ...device,
            updatedAt: serverTimestamp()
          });

          return {
            data: {
              ...device,
              updatedAt: Date.now()
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['devices'], */
      onQueryStarted: async (device, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getDevices', device.userId, draft => {
            const index = draft.findIndex(d => d.id === device.id);
            if (index !== -1) {
              draft[index] = { ...device, updatedAt: Date.now() };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    setDevices: builder.mutation({
      queryFn: () => ({
        url: '',
        method: 'PUT',
      }),
      async onQueryStarted(devicesData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getDevices', devicesData.userId, (draft) => {
            return devicesData;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* TDL */
    getTdl: builder.query({
      async queryFn(userId) {
        if (!userId) { return }
        try {
          const ref = collection(db, 'authUsersData', userId, "tdl");
          const querySnapshot = await getDocs(ref);
          let tasks = [];
          querySnapshot?.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });

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
          const newDocRef = doc(collection(db, "authUsersData", task.userId, "tdl"), task.localId);

          const newTask = {
            ...task,
            id: task.localId,
            createdAt: serverTimestamp(),
            updatedAt: null
          }

          await setDoc(newDocRef, newTask);

          return {
            data: { ...newTask, createdAt: Date.now() }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['tdl'], */
      onQueryStarted: async (task, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getTdl', task.userId, draft => {
            draft.push({ ...task, id: task.localId, createdAt: Date.now(), updatedAt: null });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    deleteTdl: builder.mutation({
      async queryFn(task) {
        try {
          const docRef = doc(collection(db, "authUsersData", task.userId, "tdl"), task.id);
          await deleteDoc(docRef);

          return {
            data: {
              id: task.id,
              res: `eliminated`
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['tdl'], */
      onQueryStarted: async (task, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getTdl', task.userId, draft => {
            return draft.filter(t => t.id !== task.id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    editTdl: builder.mutation({
      async queryFn(task) {
        try {
          const docRef = doc(collection(db, "authUsersData", task.userId, "tdl"), task.id);
          await setDoc(docRef, {
            ...task,
            updatedAt: serverTimestamp()
          });

          return {
            data: {
              ...task,
              updatedAt: Date.now()
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['tdl'], */
      onQueryStarted: async (task, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getTdl', task.userId, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            if (index !== -1) {
              draft[index] = { ...task, updatedAt: Date.now() };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    setTdl: builder.mutation({
      queryFn: () => ({
        url: '',
        method: 'PUT',
      }),
      async onQueryStarted(tdlData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getTdl', tdlData.userId, (draft) => {
            return tdlData;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* SUPPORT */
    getSupport: builder.query({
      async queryFn(userId) {
        if (!userId) { return }
        if (userId === "iJ77XT0Cdsa0xti7gpUOC2JgBWH3" /* admin */) {
          try {
            const ref = collection(db, 'supportData');
            const querySnapshot = await getDocs(ref);

            let tickets = [];
            querySnapshot?.forEach((doc) => {
              tickets.push({ id: doc.id, ...doc.data() });
            });

            return { data: tickets };
          } catch (error) {
            console.log(error);
            return { error: error };
          }
        } else {
          try {
            const ref = collection(db, 'supportData');
            const queryRef = query(ref, where('authorId', "==", userId))
            const querySnapshot = await getDocs(queryRef);

            let tickets = [];
            querySnapshot?.forEach((doc) => {
              tickets.push({ id: doc.id, ...doc.data() });
            });

            return { data: tickets };
          } catch (error) {
            console.log(error);
            return { error: error };
          }
        }
      },
      providesTags: ['support'],
    }),
    addSupport: builder.mutation({
      async queryFn(ticket) {
        try {
          const newDocRef = doc(collection(db, "supportData"), ticket.localId);

          const newTicket = {
            ...ticket,
            id: ticket.localId,
            createdAt: serverTimestamp(),
            updatedAt: null
          }

          await setDoc(newDocRef, newTicket);

          return {
            data: { ...newTicket, createdAt: Date.now() }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['support'], */
      onQueryStarted: async (ticket, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getSupport', ticket.userId, draft => {
            draft.push({ ...ticket, id: ticket.localId, createdAt: Date.now(), updatedAt: null });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    deleteSupport: builder.mutation({
      async queryFn(ticket) {
        try {
          const docRef = doc(collection(db, "supportData"), ticket.id);
          await deleteDoc(docRef);

          return {
            data: {
              id: ticket.id,
              res: `eliminated`
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['support'], */
      onQueryStarted: async (ticket, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getSupport', /* ticket.userId */"iJ77XT0Cdsa0xti7gpUOC2JgBWH3", draft => {
            return draft.filter(t => t.id !== ticket.id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    editSupport: builder.mutation({
      async queryFn(ticket) {
        try {
          const docRef = doc(collection(db, "supportData"), ticket.id);
          await setDoc(docRef, {
            ...ticket,
            updatedAt: serverTimestamp()
          });

          return {
            data: {
              ...ticket,
              updatedAt: Date.now()
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['support'], */
      onQueryStarted: async (ticket, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getSupport', /* ticket.userId */"iJ77XT0Cdsa0xti7gpUOC2JgBWH3", draft => {
            const index = draft.findIndex(t => t.id === ticket.id);
            if (index !== -1) {
              draft[index] = { ...ticket, updatedAt: Date.now() };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    setSupport: builder.mutation({
      queryFn: () => ({
        url: '',
        method: 'PUT',
      }),
      async onQueryStarted(supportData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getSupport', supportData.userId, (draft) => {
            return supportData;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* AUTH */
    signGoogle: builder.mutation({
      async queryFn() {
        try {
          await firebaseSetPersistance(firebaseAuth, firebaseBrowserLocalPersistence);

          const result = await firebaseSignInWithPopup(firebaseAuth, firebaseGoogleProvider);
          const user = result.user;

          toast.message('Auth', {
            description: `User signed in: ${user.displayName}`,
          });

          return { data: user };
        } catch (error) {
          console.log(error);
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
          });

          return { data: { message: 'Signed out successfully' } };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
    }),
    getCurrentUser: builder.query({
      async queryFn() {
        try {
          const user = firebaseAuth.currentUser;
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
  useGetContactsQuery,
  useAddContactMutation,
  useDeleteContactMutation,
  useEditContactMutation,
  useSetContactsMutation,
  useGetDuplicateContactsQuery,

  useGetDevicesQuery,
  useAddDeviceMutation,
  useDeleteDeviceMutation,
  useEditDeviceMutation,
  useSetDevicesMutation,

  useGetTdlQuery,
  useAddTdlMutation,
  useDeleteTdlMutation,
  useEditTdlMutation,
  useSetTdlMutation,

  useGetSupportQuery,
  useAddSupportMutation,
  useDeleteSupportMutation,
  useEditSupportMutation,
  useSetSupportMutation,

  useSignGoogleMutation,
  useSignOutMutation,
  useGetCurrentUserQuery,
} = apiSlice
