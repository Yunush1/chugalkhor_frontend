let navigator;

export const setNavigator = (navigate) => {
  navigator = navigate;
};

export const navigateTo = (path, options = {}) => {
  if (navigator) {
    navigator(path, options);
  }
};