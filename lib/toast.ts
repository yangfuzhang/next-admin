import { toast, ToastT } from 'sonner'

export function toastSuccess(message: string, props?: ToastT) {
  toast.success(message, {
    action: {
      label: '关闭',
      onClick: () => toast.dismiss()
    },
    ...props,
  })
}

export function toastInfo(message: string, props?: ToastT) {
  toast.info(message, {
    action: {
      label: '关闭',
      onClick: () => toast.dismiss()
    },
    ...props,
  })
}

export function toastWarning(message: string, props?: ToastT) {
  toast.warning(message, {
    action: {
      label: '关闭',
      onClick: () => toast.dismiss()
    },
    ...props,
  })
}

export function toastError(message: string | string[], props?: ToastT) {
  if (Array.isArray(message)) {
    message.forEach((msg) => {
      toast.error(msg, {
        action: {
          label: '关闭',
          onClick: () => toast.dismiss()
        },
        ...props,
      })
    })

    return
  }

  toast.error(message, {
    action: {
      label: '关闭',
      onClick: () => toast.dismiss()
    },
    ...props,
  })
}