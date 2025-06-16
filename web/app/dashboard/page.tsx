import {SignOut} from '@/modules/auth/components/sign-out';
import {getUserInfoByTokenService} from '@/modules/dashboard/services';
export const metadata = {
  title: 'Inicio',
};

export default async function Home() {
  const clientInfo = (await getUserInfoByTokenService()).data;

  return (
    <main className="flex flex-col items-center justify-center gap-48 min-h-full">
      <div className="flex flex-col font-bold justify-center">
        <p>{clientInfo?.name}</p>
        <p>{clientInfo?.id}</p>
        <p>{clientInfo?.email}</p>
      </div>
      <div className="flex flex-col gap-2">
        <SignOut />
      </div>
    </main>
  );
}
