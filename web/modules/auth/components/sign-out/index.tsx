'use client';
import { SubmitButton } from '@/modules/common/components/submit-button';
import { useRouter } from 'next/navigation';
import { signOutAction } from '../../services/actions';
import { useEffect } from 'react';

type SignOutProps = {
    className?: string;
    auto?: boolean
};

export function SignOut({ className }: SignOutProps) {
    const router = useRouter();

    const handleClieck = async () => {
        await signOutAction();
        router.push('/');
    };

    return (
        <SubmitButton onPress={handleClieck} className={className}>
            Cerrar Sesión
        </SubmitButton>
    );
}
