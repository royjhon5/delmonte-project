import UserAuthForm from './components/user-auth-form';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import backdraftImage from '../../../assets/images/backdraft.jpg';


export default function SignInPage() {
  const { error } = useAuth();

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-[2fr,1fr] lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backdraftImage})`,
          }}
        />
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Log in your credentials
            </h1>
          </div>
          {error ? <Badge variant="destructive">{error}</Badge> : ''}
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
