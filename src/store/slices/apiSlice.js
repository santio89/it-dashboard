import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { collection, doc, getDocs, addDoc, deleteDoc, setDoc, query, where, serverTimestamp } from "firebase/firestore";
import { firebaseDb as db, firebaseAuth, firebaseGoogleProvider, firebaseSetPersistance, firebaseBrowserLocalPersistence, firebaseSignInWithPopup, firebaseSignOut } from '../../config/firebase';
import { toast } from 'sonner';


export const apiSlice = createApi({
  /* invalidates tags: force refetch -> using optimistic updates instead (with rollbacks) */

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
            updatedAt: serverTimestamp()
          }

          await setDoc(newDocRef, newContact);

          /* toast.message('Contact added', {
            description: `ID: ${res.id}`,
          }); */

          return {
            data: newContact
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
            draft.push({ ...contact, id: contact.localId, createdAt: Date.now(), updatedAt: Date.now() });
          })
        );


        /* toast('Adding contact...') */

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

          /* toast.message('Contact deleted', {
            description: `ID: ${contact.id}`,
          }); */

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

        /* toast('Deleting contact...') */

        try {
          await queryFulfilled;
        } catch {
          /* toast.message('Connection error', {
            description: `Rolling back changes`,
          }); */
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

          /* toast.message('Contact edited', {
            description: `ID: ${contact.id}`,
          }); */

          return {
            data: {
              ...contact,
              updatedAt: serverTimestamp()
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

        /* toast('Editing contact...') */

        try {
          await queryFulfilled;
        } catch {
          /* toast.message('Connection error', {
            description: `Rolling back changes`,
          }); */
          patchResult.undo();
        }
      }
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
            updatedAt: serverTimestamp()
          }


          await setDoc(newDocRef, newDevice);

          /* toast.message('Device added', {
            description: `ID: ${res.id}`,
          }); */

          return {
            data: newDevice
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
            draft.push({ ...device, id: device.localId, createdAt: Date.now(), updatedAt: Date.now() });
          })
        );

        /* toast('Adding device...') */

        try {
          await queryFulfilled;
        } catch {
          /* toast.message('Connection error', {
            description: `Rolling back changes`,
          }); */
          patchResult.undo();
        }
      }
    }),
    deleteDevice: builder.mutation({
      async queryFn(device) {
        try {
          const docRef = doc(collection(db, "authUsersData", device.userId, "devices"), device.id);
          await deleteDoc(docRef);

          /*           toast.message('Device deleted', {
                      description: `ID: ${device.id}`,
                    }); */

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

        /* toast('Deleting device...') */

        try {
          await queryFulfilled;
        } catch {
          /* toast.message('Connection error', {
            description: `Rolling back changes`,
          }); */
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

          /*       toast.message('Device edited', {
                  description: `ID: ${device.id}`,
                }); */

          return {
            data: {
              ...device,
              updatedAt: serverTimestamp()
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

        /* toast('Editing device...') */

        try {
          await queryFulfilled;
        } catch {
          /* toast.message('Connection error', {
            description: `Rolling back changes`,
          }); */
          patchResult.undo();
        }
      }
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
            updatedAt: serverTimestamp()
          }

          await setDoc(newDocRef, newTask);

          /* toast.message('Task added', {
            description: `ID: ${res.id}`,
          }); */

          return {
            data: newTask
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
            draft.push({ ...task, id: task.localId, createdAt: Date.now(), updatedAt: Date.now() });
          })
        );

        /* toast('Adding task...') */

        try {
          await queryFulfilled;
        } catch {
          /* toast.message('Connection error', {
            description: `Rolling back changes`,
          }); */
          patchResult.undo();
        }
      }
    }),
    deleteTdl: builder.mutation({
      async queryFn(task) {
        try {
          const docRef = doc(collection(db, "authUsersData", task.userId, "tdl"), task.id);
          await deleteDoc(docRef);

          /* toast.message('Task deleted', {
            description: `ID: ${task.id}`,
          }); */

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

        /* toast('Deleting task...')*/

        try {
          await queryFulfilled;
        } catch {
          /* toast.message('Connection error', {
            description: `Rolling back changes`,
          }); */
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

          /* toast.message('Task edited', {
            description: `ID: ${task.id}`,
          }); */

          return {
            data: {
              ...task,
              updatedAt: serverTimestamp()
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

        /* toast('Editing task...') */

        try {
          await queryFulfilled;
        } catch {
          /* toast.message('Connection error', {
            description: `Rolling back changes`,
          }); */
          patchResult.undo();
        }
      }
    }),

    /* SUPPORT */
    getSupport: builder.query({
      async queryFn(userId) {
        if (!userId) { return }
        /* admin id */
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
          /* const newDocId = doc(collection(db, "supportData")).id; */
          const newDocRef = doc(collection(db, "supportData"), ticket.localId);

          const newTicket = {
            ...ticket,
            id: ticket.localId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }

          await setDoc(newDocRef, newTicket);

          /* toast.message('Ticket added', {
            description: `ID: ${res.id}`,
          }); */

          return {
            data: newTicket
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['support'], */
      /* optimistic updates for ticket.userId */
      onQueryStarted: async (ticket, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getSupport', ticket.userId, draft => {
            draft.push({ ...ticket, id: ticket.localId, createdAt: Date.now(), updatedAt: Date.now() });
          })
        );

        /* toast('Adding ticket...') */

        try {
          await queryFulfilled;
        } catch {
          /* toast.message('Connection error', {
            description: `Rolling back changes`,
          }); */
          patchResult.undo();
        }
      }
    }),
    deleteSupport: builder.mutation({
      async queryFn(ticket) {
        try {
          const docRef = doc(collection(db, "supportData"), ticket.id);
          await deleteDoc(docRef);

          /* toast.message('Ticket deleted', {
            description: `ID: ${ticket.id}`,
          }); */

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
      /* optimistic updates for admin id */
      onQueryStarted: async (ticket, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getSupport', /* ticket.userId */"iJ77XT0Cdsa0xti7gpUOC2JgBWH3", draft => {
            return draft.filter(t => t.id !== ticket.id);
          })
        );

        /* toast('Deleting ticket...') */

        try {
          await queryFulfilled;
        } catch {
          /* toast.message('Connection error', {
            description: `Rolling back changes`,
          }); */
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

          /* toast.message('Ticket edited', {
            description: `ID: ${ticket.id}`,
          }); */

          return {
            data: {
              ...ticket,
              updatedAt: serverTimestamp()
            }
          };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      /* invalidatesTags: ['support'], */
      /* optimistic updates for admin id */
      onQueryStarted: async (ticket, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getSupport', /* ticket.userId */"iJ77XT0Cdsa0xti7gpUOC2JgBWH3", draft => {
            const index = draft.findIndex(t => t.id === ticket.id);
            if (index !== -1) {
              draft[index] = { ...ticket, updatedAt: Date.now() };
            }
          })
        );

        /* toast('Editing ticket...') */

        try {
          await queryFulfilled;
        } catch {
          /* toast.message('Connection error', {
            description: `Rolling back changes`,
          }); */
          patchResult.undo();
        }
      }
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
          });

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
