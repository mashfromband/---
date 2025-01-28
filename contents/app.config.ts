export default defineAppConfig({
  ui: {
    primary: 'el_yellow',
    container: {
      constrained: 'max-w-screen-2xl'
    },
    button: {
      variant: {
        solid: 'text-gray-900',
        outline: 'text-gray-900',
        soft: 'text-gray-900',
        ghost: 'text-gray-900',
        link: 'text-gray-900'
      }
    },
    alert: {
      default: {
        color: 'primary',
        variant: 'soft'
      },
      description: 'text-sm font-bold'
    },
    notification: {
      progress: {
        base: 'el_notification-progress', // app.vue で style 追加
      },
    },
  }
})
