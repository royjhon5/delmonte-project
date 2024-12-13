import AppProvider from './provider'
import AppRouter from './routes'


function App() {
  return (
    <>
    <AppProvider>
      <AppRouter />
    </AppProvider>  
    </>
  )
}

export default App
