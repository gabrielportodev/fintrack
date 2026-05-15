import { useCallback, useState } from 'react'

export const useDialog = (initialState: boolean = false) => {
  const [open, setOpen] = useState(initialState)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  return { open, handleOpen, handleClose }
}
