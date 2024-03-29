import Logo from '@/app/components/logo';
import CreateAccountForm from '@/app/components/create-account-form';
import { createUser } from '@/app/lib/data';

export default function CreateAccountPage() {
    return (
        <main className="login-page">

            <Logo />
            <CreateAccountForm createUser={createUser} />
        </main>
    )
}