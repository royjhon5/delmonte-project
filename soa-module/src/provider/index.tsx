import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthContext";

import { useRouter } from "@/routes/hooks";
import { store } from "@/store";
import { ThemeProvider } from "@/theme/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, Suspense } from "react";
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

export const queryClient = new QueryClient();
const ErrorFallback = ({ error }: FallbackProps) => {
    const router = useRouter();
    console.log('error', error);
    return (
      <div
        className="flex h-screen w-screen flex-col items-center  justify-center text-red-500"
        role="alert"
      >
        <h2 className="text-2xl font-semibold">
          Ooops, something went wrong :({' '}
        </h2>
        <pre className="text-2xl font-bold">{error.message}</pre>
        <pre>{error.stack}</pre>
        <Button className="mt-4" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
};


export default function AppProvider({
    children
}: {children: ReactNode;

}) {
    return (
        <Suspense>
            <HelmetProvider>
                <BrowserRouter>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <QueryClientProvider client={queryClient}>
                        {/* <ReactQueryDevtools /> */}
                        <Provider store={store}>    
                          <AuthProvider>
                            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                                <SidebarProvider>{children}</SidebarProvider>
                            </ThemeProvider>
                          </AuthProvider>
                          </Provider>
                        </QueryClientProvider>
                    </ErrorBoundary>
                </BrowserRouter>
            </HelmetProvider>
        </Suspense>
    )
}