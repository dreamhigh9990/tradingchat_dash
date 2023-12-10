const AppLoader = () => {
  return (
    <div className='app-loader'>
      <div className='loader-spin'>
        <span className='crema-dot crema-dot-spin'>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
      </div>
    </div>
  );
};

// https://loading.io/spinner/
export const AppLoaderRipple = () => {
  return (
    <div className='app-loader'>
      <div class="lds-ripple"><div></div><div></div></div>
    </div>
  );
};

export const Loader = () => {
  return (
    <div className='loader-spin'>
      <span className='crema-dot crema-dot-spin'>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </span>
    </div>
  );
};

export default AppLoader;
