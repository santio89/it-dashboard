import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { collection, doc, getDocs, addDoc, deleteDoc, setDoc, query, where, serverTimestamp, orderBy, limit, startAfter } from "firebase/firestore";
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
          const q = query(ref, orderBy('normalizedName'), limit(51)); /* fetch extra to know if there are more */
          const querySnapshot = await getDocs(q);

          let newLastVisible = null
          if (querySnapshot.docs.length === 51) {
            querySnapshot.docs.pop() /* remove extra */
            newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
          }

          let contacts = [];
          querySnapshot?.forEach((doc) => {
            contacts.push({ id: doc.id, ...doc.data() });
          });

          return { data: { contacts, lastVisible: newLastVisible } };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      providesTags: ['contacts'],
    }),
    getContactsNext: builder.query({
      async queryFn({ userId, lastVisible }) {
        if (!userId || !lastVisible) { return { data: { contacts: null, lastVisible: null } } }
        try {
          const ref = collection(db, 'authUsersData', userId, 'contacts');
          const q = query(ref, orderBy('normalizedName'), startAfter(lastVisible), limit(51));
          const querySnapshot = await getDocs(q);

          let newLastVisible = null
          if (querySnapshot.docs.length === 51) {
            querySnapshot.docs.pop()
            newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
          }

          let contacts = [];
          querySnapshot.forEach((doc) => {
            contacts.push({ id: doc.id, ...doc.data() });
          });

          return { data: { contacts, lastVisible: newLastVisible } };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      async onQueryStarted({ userId, lastVisible }, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;

        if (result.data) {
          const { contacts } = result.data;

          // Update the cache by merging new contacts
          dispatch(
            apiSlice.util.updateQueryData('getContacts', userId, (draft) => {
              if (!draft.contacts) {
                draft.contacts = [];
              }

              /* draft.contacts.push(...contacts); */

              contacts.forEach((contact) => {
                // Check if the contact ID already exists in the draft
                const exists = draft.contacts.some(existingContact => existingContact.id === contact.id);

                // If it doesn't exist, push the new contact
                if (!exists) {
                  draft.contacts.push(contact);
                }
              });
              draft.lastVisible = result.data.lastVisible
            })
          );
        }
      }
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
            draft.contacts.push({ ...contact, id: contact.localId, createdAt: Date.now(), updatedAt: null });
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
            draft.contacts = draft.contacts.filter(c => c.id !== contact.id);
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
            const index = draft.contacts.findIndex(c => c.id === contact.id);
            if (index !== -1) {
              draft.contacts[index] = { ...contact, updatedAt: Date.now() };
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
            draft.contacts = contactsData;
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
          const q = query(ref, orderBy('normalizedName'), limit(51));
          const querySnapshot = await getDocs(q);

          let newLastVisible = null
          if (querySnapshot.docs.length === 51) {
            querySnapshot.docs.pop()
            newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
          }

          let devices = [];
          querySnapshot?.forEach((doc) => {
            devices.push({ id: doc.id, ...doc.data() });
          });

          return { data: { devices, lastVisible: newLastVisible } };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      providesTags: ['devices'],
    }),
    getDevicesNext: builder.query({
      async queryFn({ userId, lastVisible }) {
        if (!userId || !lastVisible) { return { data: { devices: null, lastVisible: null } } }
        try {
          const ref = collection(db, 'authUsersData', userId, 'devices');
          const q = query(ref, orderBy('normalizedName'), startAfter(lastVisible), limit(51));
          const querySnapshot = await getDocs(q);

          let newLastVisible = null
          if (querySnapshot.docs.length === 51) {
            querySnapshot.docs.pop()
            newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
          }

          let devices = [];
          querySnapshot.forEach((doc) => {
            devices.push({ id: doc.id, ...doc.data() });
          });

          return { data: { devices, lastVisible: newLastVisible } };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      async onQueryStarted({ userId, lastVisible }, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;

        if (result.data) {
          const { devices } = result.data;

          // Update the cache by merging new devices
          dispatch(
            apiSlice.util.updateQueryData('getDevices', userId, (draft) => {
              if (!draft.devices) {
                draft.devices = [];
              }

              /* draft.devices.push(...devices); */

              devices.forEach((device) => {
                // Check if the device ID already exists in the draft
                const exists = draft.devices.some(existingDevice => existingDevice.id === device.id);

                // If it doesn't exist, push the new device
                if (!exists) {
                  draft.devices.push(device);
                }
              });
              draft.lastVisible = result.data.lastVisible
            })
          );
        }
      }
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
            draft.devices.push({ ...device, id: device.localId, createdAt: Date.now(), updatedAt: null });
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
            draft.devices = draft.devices.filter(d => d.id !== device.id);
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
            const index = draft.devices.findIndex(d => d.id === device.id);
            if (index !== -1) {
              draft.devices[index] = { ...device, updatedAt: Date.now() };
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
            draft.devices = devicesData;
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
          const q = query(ref, orderBy('localTime', 'desc'), limit(51));
          const querySnapshot = await getDocs(q);

          let newLastVisible = null
          if (querySnapshot.docs.length === 51) {
            querySnapshot.docs.pop()
            newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
          }

          let tasks = [];
          querySnapshot?.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });

          return { data: { tasks, lastVisible: newLastVisible } };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      providesTags: ['tdl'],
    }),
    getTdlNext: builder.query({
      async queryFn({ userId, lastVisible }) {
        if (!userId || !lastVisible) { return { data: { tasks: null, lastVisible: null } } }
        try {
          const ref = collection(db, 'authUsersData', userId, 'tdl');
          const q = query(ref, orderBy('localTime', 'desc'), startAfter(lastVisible), limit(51));
          const querySnapshot = await getDocs(q);

          let newLastVisible = null
          if (querySnapshot.docs.length === 51) {
            querySnapshot.docs.pop()
            newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
          }

          let tasks = [];
          querySnapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });

          return { data: { tasks, lastVisible: newLastVisible } };
        } catch (error) {
          console.log(error);
          return { error: error };
        }
      },
      async onQueryStarted({ userId, lastVisible }, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;

        if (result.data) {
          const { tasks } = result.data;

          // Update the cache by merging new tasks
          dispatch(
            apiSlice.util.updateQueryData('getTdl', userId, (draft) => {
              if (!draft.tasks) {
                draft.tasks = [];
              }

              /* draft.tasks.push(...tasks); */

              tasks.forEach((task) => {
                // Check if the task ID already exists in the draft
                const exists = draft.tasks.some(existingTask => existingTask.id === task.id);

                // If it doesn't exist, push the new task
                if (!exists) {
                  draft.tasks.push(task);
                }
              });
              draft.lastVisible = result.data.lastVisible
            })
          );
        }
      }
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
            draft.tasks.push({ ...task, id: task.localId, createdAt: Date.now(), updatedAt: null });
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
            draft.tasks = draft.tasks.filter(t => t.id !== task.id);
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
            const index = draft.tasks.findIndex(t => t.id === task.id);
            if (index !== -1) {
              draft.tasks[index] = { ...task, updatedAt: Date.now() };
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
            draft.tasks = tdlData;
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
            const q = query(ref, orderBy('localTime', 'desc'), limit(51));
            const querySnapshot = await getDocs(q);

            let newLastVisible = null
            if (querySnapshot.docs.length === 51) {
              querySnapshot.docs.pop()
              newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
            }

            let tickets = [];
            querySnapshot?.forEach((doc) => {
              tickets.push({ id: doc.id, ...doc.data() });
            });

            return { data: { tickets, lastVisible: newLastVisible } };
          } catch (error) {
            console.log(error);
            return { error: error };
          }
        } else {
          try {
            const ref = collection(db, 'supportData');
            const q = query(ref, where('authorId', "==", userId), orderBy('localTime', 'desc'), limit(51))
            const querySnapshot = await getDocs(q);

            let newLastVisible = null
            if (querySnapshot.docs.length === 51) {
              querySnapshot.docs.pop()
              newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
            }

            let tickets = [];
            querySnapshot?.forEach((doc) => {
              tickets.push({ id: doc.id, ...doc.data() });
            });

            return { data: { tickets, lastVisible: newLastVisible } };
          } catch (error) {
            console.log(error);
            return { error: error };
          }
        }
      },
      providesTags: ['support'],
    }),
    getSupportNext: builder.query({
      async queryFn({ userId, lastVisible }) {
        if (!userId || !lastVisible) { return { data: { tickets: null, lastVisible: null } } }
        if (userId === "iJ77XT0Cdsa0xti7gpUOC2JgBWH3" /* admin */) {
          try {
            const ref = collection(db, 'supportData');
            const q = query(ref, where('authorId', "==", userId), orderBy('localTime', 'desc'), startAfter(lastVisible), limit(51));
            const querySnapshot = await getDocs(q);

            let newLastVisible = null
            if (querySnapshot.docs.length === 51) {
              querySnapshot.docs.pop()
              newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
            }

            let tickets = [];
            querySnapshot.forEach((doc) => {
              tickets.push({ id: doc.id, ...doc.data() });
            });

            return { data: { tickets, lastVisible: newLastVisible } };
          } catch (error) {
            console.log(error.error);
            return { error: error };
          }

        } else {
          try {
            const ref = collection(db, 'supportData');
            const q = query(ref, orderBy('localTime', 'desc'), startAfter(lastVisible), limit(51));
            const querySnapshot = await getDocs(q);

            let newLastVisible = null
            if (querySnapshot.docs.length === 51) {
              querySnapshot.docs.pop()
              newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
            }

            let tickets = [];
            querySnapshot.forEach((doc) => {
              tickets.push({ id: doc.id, ...doc.data() });
            });

            return { data: { tickets, lastVisible: newLastVisible } };
          } catch (error) {
            console.log(error);
            return { error: error };
          }
        }
      },
      async onQueryStarted({ userId, lastVisible }, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;

        if (result.data) {
          const { tickets } = result.data;

          // Update the cache by merging new tasks
          dispatch(
            apiSlice.util.updateQueryData('getSupport', userId, (draft) => {
              if (!draft.tickets) {
                draft.tickets = [];
              }

              /* draft.tasks.push(...tasks); */

              tickets.forEach((task) => {
                // Check if the task ID already exists in the draft
                const exists = draft.tickets.some(existingTask => existingTask.id === task.id);

                // If it doesn't exist, push the new task
                if (!exists) {
                  draft.tickets.push(task);
                }
              });
              draft.lastVisible = result.data.lastVisible
            })
          );
        }
      }
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
            draft.tickets.push({ ...ticket, id: ticket.localId, createdAt: Date.now(), updatedAt: null });
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
            draft.tickets = draft.tickets.filter(t => t.id !== ticket.id);
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
            const index = draft.tickets.findIndex(t => t.id === ticket.id);
            if (index !== -1) {
              draft.tickets[index] = { ...ticket, updatedAt: Date.now() };
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
            draft.tickets = supportData;
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
  useGetContactsNextQuery,
  useAddContactMutation,
  useDeleteContactMutation,
  useEditContactMutation,
  useSetContactsMutation,
  useGetDuplicateContactsQuery,

  useGetDevicesQuery,
  useGetDevicesNextQuery,
  useAddDeviceMutation,
  useDeleteDeviceMutation,
  useEditDeviceMutation,
  useSetDevicesMutation,

  useGetTdlQuery,
  useGetTdlNextQuery,
  useAddTdlMutation,
  useDeleteTdlMutation,
  useEditTdlMutation,
  useSetTdlMutation,

  useGetSupportQuery,
  useGetSupportNextQuery,
  useAddSupportMutation,
  useDeleteSupportMutation,
  useEditSupportMutation,
  useSetSupportMutation,

  useSignGoogleMutation,
  useSignOutMutation,
  useGetCurrentUserQuery,
} = apiSlice
