import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'Iniciar sesión',
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Bienvenido</h1>
        <p className="mt-2 text-slate-400">
          Ingresa a tu cuenta para continuar
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
