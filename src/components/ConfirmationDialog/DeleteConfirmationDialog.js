import React from 'react'
import PropTypes from 'prop-types'
import ConfirmationDialog from 'components/ConfirmationDialog'
import { deleteFilesOfPack } from 'localStorage/fileStorage'
import { deleteLocalPack } from 'localStorage/localPacks'
import { useHistory } from 'react-router-dom'

let callback
const DeleteConfirmationDialog = React.forwardRef((props, ref) => {
  const confirmationDialogRef = React.useRef()
  const history = useHistory()

  React.useImperativeHandle(ref, () => ({
    async confirmPackDeletion(packUUID) {
      const { confirmed, checked } = await confirmationDialogRef.current
        .open('Вы уверены, что хотите удалить пак? Он будет удален безвозвратно.',
          'Удалить',
          'Удалить все связанные медиафайлы'
        )
      const deleteFiles = checked
      if(confirmed) {
        deleteFiles && await deleteFilesOfPack(packUUID)
        await deleteLocalPack(packUUID)
        history.push('/')
      }
      return confirmed
    },

    confirmRoundDeletion() {
      return new Promise(resolve => {
        callback = resolve
        confirmationDialogRef.current
          .open('Вы уверены, что хотите удалить раунд? Все вопросы также будут удалены.', 'Удалить')
          .then(callback)
      })
    }
  }))

  return (
    <ConfirmationDialog ref={confirmationDialogRef}></ConfirmationDialog>
  )
})

DeleteConfirmationDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

DeleteConfirmationDialog.displayName = 'DeleteConfirmationDialog'
export default DeleteConfirmationDialog
