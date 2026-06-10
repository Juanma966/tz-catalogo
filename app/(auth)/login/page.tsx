import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'Iniciar sesión',
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 px-8 py-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Bienvenido</h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Ingresá a tu cuenta para continuar
          </p>
        </div>

        <LoginForm />
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        Generador de Catálogos PDF
      </p>
    </div>
  );
}
