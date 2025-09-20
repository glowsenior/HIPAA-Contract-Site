// Optional web vitals reporting
const reportWebVitals = (onPerfEntry?: any) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Web vitals reporting is optional
    console.log('Web vitals reporting is available');
  }
};

export default reportWebVitals;
