import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setModal } from '../store/slices/modalSlice'
import { useAddTdlMutation, useDeleteTdlMutation, useEditTdlMutation } from '../store/slices/apiSlice'
import { useTranslation } from '../hooks/useTranslation'
import { toast } from 'sonner'

export default function TasksDataModal({ modalData }) {
  const lang = useTranslation()

  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)


/*   const addTdlFn = async (e) => {
    e.preventDefault()

    if (resultAddTdl.isLoading) {
      return
    }

    if (newTaskTitle === "") {
      return
    }

    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority,
      status: newTaskStatus,
      category: newTaskCategory,
      author: modalData?.user.email,
      authorId: modalData?.user.uid,
      localId: crypto.randomUUID().replace(/-/g, ''),
      localTime: Date.now(),
      userId: modalData.user.uid
    }

    dispatch(setModal({ active: false, data: {} }))

    try {
      toast(`${lang.addingTask}...`)
      const res = await addTdl({ ...newTask, userId: modalData.user.uid })
      toast.message(lang.taskAdded, {
        description: `ID: ${res.data.id}`,
      });
    } catch {
      toast(lang.errorPerformingRequest)
    }
  }

  const deleteTdlFn = async (e, task) => {
    e.preventDefault()

    if (resultDeleteTdl.isLoading) {
      return
    }

    dispatch(setModal({ active: false, data: {} }))

    try {
      toast(`${lang.deletingTask}...`)
      await deleteTdl(task)
      toast.message(lang.taskDeleted, {
        description: `ID: ${task.id}`,
      });
    } catch {
      toast(lang.errorPerformingRequest)
    }
  }
 */
  useEffect(() => {
    if (!modalActive) {
      /* setNewTaskTitle("")
      setNewTaskDescription("")
      setNewTaskPriority("medium")
      setNewTaskStatus("pending")
      setNewTaskCategory("personal")
      setEditMode(false)
      setDeleteMode(false) */
    }
  }, [modalActive])


  return (
    <>
    </>
  )
}
