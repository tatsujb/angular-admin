export const conf = {
  width: 300,
  message: '',
  position: {
    at: 'top',
    my: 'top',
    offset: '0 52'
  },
  animation: {
    show: {
      type: 'slide',
      duration: 200,
      from: {
        top: 0
      }
    },
    hide: {
      type: 'slide',
      duration: 200,
      to: {
        top: 0
      }
    }
  }
};
