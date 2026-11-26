import LoginHero from './LoginHero';
import LoginForm from './LoginForm';

export default function Login() {
  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-gray-800">
      <LoginHero />
      <LoginForm />
    </div>
  );
}