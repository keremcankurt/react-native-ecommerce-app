import { Provider } from 'react-redux';
import { store } from './app/store';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import AppNavigator from './navigation/AppNavigator';
import { FilterProvider } from './context/filterContext';


export default function App() {
  return (
    <Provider store={store}>
    <FilterProvider>
      <AppNavigator/>
      <Toast/>
    </FilterProvider>
    </Provider>
  );
}


