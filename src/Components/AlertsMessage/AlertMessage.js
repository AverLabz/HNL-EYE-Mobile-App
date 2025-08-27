import { showMessage } from 'react-native-flash-message';

const showWarning = (message, description) => {
  showMessage({
    message,
    description: description,
    type: 'warning',
    icon: 'warning',
    style: { backgroundColor: "#CC3300", width: "90%", alignItems: "center", justifyContent: "flex-start", },
    duration: 2500
  });
};

const showSuccess = message => {
  showMessage({
    message,
    type: 'success',
    icon: 'success',
    style: { width: "90%", alignItems: "center", justifyContent: "flex-start", },
  });
};


export { showWarning, showSuccess };
